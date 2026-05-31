(function () {
  // ── Config ──────────────────────────────────────────────────────────────
  const script = document.currentScript;
  const token = script.getAttribute("data-token");
  const API_URL = "http://localhost:3000/api/feedback";

  if (!token) {
    console.error("[FeedbackWidget] No data-token found on script tag");
    return;
  }

  // ── Styles ───────────────────────────────────────────────────────────────
  const styles = `
    #fw-button {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #4F46E5;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 24px;
      font-size: 14px;
      font-family: sans-serif;
      cursor: pointer;
      z-index: 999999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transition: background 0.2s;
    }
    #fw-button:hover { background: #4338CA; }

    #fw-overlay {
      position: fixed;
      inset: 0;
      z-index: 999998;
      cursor: crosshair;
      display: none;
    }

    #fw-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    #fw-modal {
      position: fixed;
      bottom: 80px;
      right: 24px;
      width: 320px;
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      z-index: 9999999;
      font-family: sans-serif;
      display: none;
    }

    #fw-modal h3 {
      margin: 0 0 8px 0;
      font-size: 15px;
      color: #111;
    }

    #fw-modal p {
      margin: 0 0 12px 0;
      font-size: 12px;
      color: #666;
    }

    #fw-comment {
      width: 100%;
      height: 80px;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 8px;
      font-size: 13px;
      resize: none;
      box-sizing: border-box;
      font-family: sans-serif;
    }

    #fw-comment:focus { outline: none; border-color: #4F46E5; }

    #fw-actions {
      display: flex;
      gap: 8px;
      margin-top: 10px;
    }

    #fw-submit {
      flex: 1;
      background: #4F46E5;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 8px;
      font-size: 13px;
      cursor: pointer;
    }

    #fw-submit:hover { background: #4338CA; }
    #fw-submit:disabled { background: #a5b4fc; cursor: not-allowed; }

    #fw-cancel {
      background: #f3f4f6;
      color: #374151;
      border: none;
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 13px;
      cursor: pointer;
    }

    #fw-cancel:hover { background: #e5e7eb; }

    #fw-preview {
      width: 100%;
      border-radius: 8px;
      margin-bottom: 10px;
      border: 1px solid #eee;
      display: none;
    }

    #fw-draw-hint {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.75);
      color: white;
      padding: 10px 20px;
      border-radius: 24px;
      font-size: 14px;
      font-family: sans-serif;
      z-index: 9999999;
      display: none;
    }
  `;

  // Inject styles
  const styleEl = document.createElement("style");
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // ── DOM Elements ─────────────────────────────────────────────────────────
  const button = document.createElement("button");
  button.id = "fw-button";
  button.textContent = "Feedback";
  document.body.appendChild(button);

  const overlay = document.createElement("div");
  overlay.id = "fw-overlay";
  const canvas = document.createElement("canvas");
  canvas.id = "fw-canvas";
  overlay.appendChild(canvas);
  document.body.appendChild(overlay);

  const hint = document.createElement("div");
  hint.id = "fw-draw-hint";
  hint.textContent =
    "Draw on the screen to highlight an issue, then click Done";
  document.body.appendChild(hint);

  const doneBtn = document.createElement("button");
  doneBtn.textContent = "Done";
  doneBtn.style.cssText = `
    position: fixed; top: 20px; right: 20px;
    background: #4F46E5; color: white;
    border: none; padding: 10px 20px;
    border-radius: 8px; font-size: 14px;
    cursor: pointer; z-index: 9999999;
    font-family: sans-serif; display: none;
  `;
  document.body.appendChild(doneBtn);

  const modal = document.createElement("div");
  modal.id = "fw-modal";
  modal.innerHTML = `
    <h3>Submit Feedback</h3>
    <p>Describe the issue you're experiencing</p>
    <img id="fw-preview" />
    <textarea id="fw-comment" placeholder="What's the issue?"></textarea>
    <div id="fw-actions">
      <button id="fw-cancel">Cancel</button>
      <button id="fw-submit">Submit</button>
    </div>
  `;
  document.body.appendChild(modal);

  // ── State ─────────────────────────────────────────────────────────────────
  let screenshotDataUrl = null;
  let isDrawing = false;
  let ctx = null;
  let lastX = 0;
  let lastY = 0;

  // ── Screenshot + Draw Flow ────────────────────────────────────────────────
  button.addEventListener("click", async () => {
    button.textContent = "Capturing...";
    button.disabled = true;

    try {
      // Load html2canvas dynamically
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
      );

      // Hide widget button before screenshot
      button.style.display = "none";

      const capturedCanvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        scale: 1,
      });

      screenshotDataUrl = capturedCanvas.toDataURL("image/png");

      // Setup drawing canvas over screenshot
      overlay.style.backgroundImage = `url(${screenshotDataUrl})`;
      overlay.style.backgroundSize = "cover";
      overlay.style.display = "block";

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx = canvas.getContext("2d");
      ctx.strokeStyle = "#EF4444";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";

      hint.style.display = "block";
      doneBtn.style.display = "block";
    } catch (err) {
      console.error("[FeedbackWidget] Screenshot failed:", err);
      button.textContent = "Feedback";
      button.disabled = false;
      button.style.display = "block";
    }
  });

  // Drawing logic
  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
  });

  canvas.addEventListener("mouseup", () => {
    isDrawing = false;
  });
  canvas.addEventListener("mouseleave", () => {
    isDrawing = false;
  });

  // Done drawing — merge screenshot + drawing into one image
  doneBtn.addEventListener("click", () => {
    const mergedCanvas = document.createElement("canvas");
    mergedCanvas.width = window.innerWidth;
    mergedCanvas.height = window.innerHeight;
    const mergedCtx = mergedCanvas.getContext("2d");

    const bg = new Image();
    bg.onload = () => {
      mergedCtx.drawImage(bg, 0, 0);
      mergedCtx.drawImage(canvas, 0, 0);
      screenshotDataUrl = mergedCanvas.toDataURL("image/png");

      // Show modal with preview
      const preview = document.getElementById("fw-preview");
      preview.src = screenshotDataUrl;
      preview.style.display = "block";

      overlay.style.display = "none";
      hint.style.display = "none";
      doneBtn.style.display = "none";
      modal.style.display = "block";
    };
    bg.src = screenshotDataUrl;
  });

  // ── Modal Actions ─────────────────────────────────────────────────────────
  document.getElementById("fw-cancel") &&
    document.addEventListener("click", (e) => {
      if (e.target.id === "fw-cancel") {
        resetWidget();
      }

      if (e.target.id === "fw-submit") {
        submitFeedback();
      }
    });

  async function submitFeedback() {
    const comment = document.getElementById("fw-comment").value.trim();
    if (!comment) {
      alert("Please describe the issue");
      return;
    }

    const submitBtn = document.getElementById("fw-submit");
    submitBtn.textContent = "Submitting...";
    submitBtn.disabled = true;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          screenshot: screenshotDataUrl,
          comment,
          url: window.location.href,
          browser: navigator.userAgent,
          device: getDevice(),
        }),
      });

      if (response.ok) {
        modal.innerHTML = `
          <div style="text-align:center; padding: 20px 0">
            <div style="font-size:32px">✓</div>
            <h3 style="margin: 8px 0">Thank you!</h3>
            <p style="color:#666">Your feedback has been submitted.</p>
          </div>
        `;
        setTimeout(resetWidget, 2000);
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      alert("Failed to submit feedback. Please try again.");
      submitBtn.textContent = "Submit";
      submitBtn.disabled = false;
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  function resetWidget() {
    modal.style.display = "none";
    overlay.style.display = "none";
    hint.style.display = "none";
    doneBtn.style.display = "none";
    screenshotDataUrl = null;
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    button.textContent = "Feedback";
    button.disabled = false;
    button.style.display = "block";
    modal.innerHTML = `
      <h3>Submit Feedback</h3>
      <p>Describe the issue you're experiencing</p>
      <img id="fw-preview" />
      <textarea id="fw-comment" placeholder="What's the issue?"></textarea>
      <div id="fw-actions">
        <button id="fw-cancel">Cancel</button>
        <button id="fw-submit">Submit</button>
      </div>
    `;
  }

  function getDevice() {
    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) return "Mobile";
    if (/tablet/i.test(ua)) return "Tablet";
    return "Desktop";
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
})();
