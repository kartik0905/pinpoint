(function () {
  // ── Config ──────────────────────────────────────────────────────────────
  const script = document.currentScript;
  const token = script.getAttribute("data-token");
  const API_URL = "https://pinpoint-backend-cq9k.onrender.com/api/feedback";

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
      padding: 14px 24px;
      border-radius: 100px;
      font-size: 14px;
      font-weight: 600;
      font-family: system-ui, -apple-system, sans-serif;
      cursor: pointer;
      z-index: 999999;
      box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);
      transition: all 0.2s ease;
    }
    #fw-button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(79, 70, 229, 0.5); }
    #fw-button:disabled { background: #a5b4fc; transform: none; cursor: not-allowed; }

    #fw-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 999998;
      cursor: crosshair;
      display: none;
      overflow: hidden;
      background: rgba(0,0,0,0.1);
    }

    #fw-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    /* THE NEW TOOLBAR */
    #fw-toolbar {
      position: fixed;
      top: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: #18181b; /* Dark zinc */
      padding: 8px 12px;
      border-radius: 100px;
      display: none; /* Hidden by default */
      align-items: center;
      gap: 12px;
      z-index: 9999999;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      font-family: system-ui, -apple-system, sans-serif;
    }

    #fw-toolbar span {
      color: #a1a1aa;
      font-size: 13px;
      font-weight: 500;
      margin: 0 8px;
    }

    .fw-tool-btn {
      background: rgba(255,255,255,0.1);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 100px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .fw-tool-btn:hover { background: rgba(255,255,255,0.15); }
    
    .fw-btn-primary { background: #4F46E5 !important; }
    .fw-btn-primary:hover { background: #4338CA !important; }
    
    .fw-btn-danger { background: rgba(239, 68, 68, 0.15) !important; color: #fca5a5 !important; }
    .fw-btn-danger:hover { background: rgba(239, 68, 68, 0.25) !important; }

    /* Modal Styles */
    #fw-modal {
      position: fixed;
      bottom: 80px;
      right: 24px;
      width: 340px;
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      z-index: 9999999;
      font-family: system-ui, -apple-system, sans-serif;
      display: none;
    }

    #fw-modal h3 { margin: 0 0 4px 0; font-size: 18px; color: #18181b; }
    #fw-modal p { margin: 0 0 16px 0; font-size: 13px; color: #71717a; }

    #fw-comment {
      width: 100%;
      height: 90px;
      border: 1px solid #e4e4e7;
      border-radius: 12px;
      padding: 12px;
      font-size: 14px;
      resize: none;
      box-sizing: border-box;
      font-family: inherit;
      background: #fafafa;
    }
    #fw-comment:focus { outline: none; border-color: #4F46E5; background: white; }

    #fw-actions { display: flex; gap: 10px; margin-top: 16px; }

    #fw-submit {
      flex: 1;
      background: #4F46E5;
      color: white;
      border: none;
      padding: 12px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
    #fw-submit:hover { background: #4338CA; }
    #fw-submit:disabled { background: #a5b4fc; cursor: not-allowed; }

    #fw-cancel-modal {
      background: #f4f4f5;
      color: #3f3f46;
      border: none;
      padding: 12px 20px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
    #fw-cancel-modal:hover { background: #e4e4e7; }

    #fw-preview {
      width: 100%;
      border-radius: 8px;
      margin-bottom: 12px;
      border: 1px solid #e4e4e7;
      display: none;
      max-height: 120px;
      object-fit: cover;
      object-position: top;
    }
  `;

  // Inject styles
  const styleEl = document.createElement("style");
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // ── DOM Elements ─────────────────────────────────────────────────────────
  const button = document.createElement("button");
  button.id = "fw-button";
  button.textContent = "Report Issue";
  document.body.appendChild(button);

  const overlay = document.createElement("div");
  overlay.id = "fw-overlay";
  const canvas = document.createElement("canvas");
  canvas.id = "fw-canvas";
  overlay.appendChild(canvas);
  document.body.appendChild(overlay);

  // Unified Toolbar
  const toolbar = document.createElement("div");
  toolbar.id = "fw-toolbar";
  toolbar.innerHTML = `
    <button id="fw-cancel-draw" class="fw-tool-btn">✕ Cancel</button>
    <span>Draw on the screen to highlight</span>
    <button id="fw-undo" class="fw-tool-btn">Undo</button>
    <button id="fw-clear" class="fw-tool-btn fw-btn-danger">Clear</button>
    <button id="fw-done" class="fw-tool-btn fw-btn-primary">✓ Done</button>
  `;
  document.body.appendChild(toolbar);

  const modal = document.createElement("div");
  modal.id = "fw-modal";
  modal.innerHTML = `
    <h3>Submit Feedback</h3>
    <p>Describe the issue you're experiencing</p>
    <img id="fw-preview" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
    <textarea id="fw-comment" placeholder="What exactly is broken?"></textarea>
    <div id="fw-actions">
      <button id="fw-cancel-modal">Cancel</button>
      <button id="fw-submit">Send Report</button>
    </div>
  `;
  document.body.appendChild(modal);

  // ── State ─────────────────────────────────────────────────────────────────
  let screenshotDataUrl = null;
  let isDrawing = false;
  let ctx = null;
  let lastX = 0;
  let lastY = 0;
  let strokes = [];
  let currentStroke = [];

  // ── Screenshot + Draw Flow ────────────────────────────────────────────────
  button.addEventListener("click", async () => {
    button.textContent = "Capturing...";
    button.disabled = true;

    try {
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js",
      );

      screenshotDataUrl = await htmlToImage.toPng(document.body, {
        pixelRatio: 1,
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        style: {
          transform: "none", // Prevents weird scrolling offsets
          margin: "0",
        },
      });

      // Hide button, lock scroll, show overlay and toolbar
      button.style.display = "none";
      document.body.style.overflow = "hidden";

      overlay.style.backgroundImage = `url(${screenshotDataUrl})`;
      overlay.style.backgroundSize = "100% 100%";
      overlay.style.backgroundRepeat = "no-repeat";
      overlay.style.backgroundPosition = "top left";
      overlay.style.display = "block";

      canvas.width = document.documentElement.clientWidth;
      canvas.height = document.documentElement.clientHeight;
      ctx = canvas.getContext("2d");
      ctx.strokeStyle = "#EF4444"; // Red ink
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      strokes = [];
      currentStroke = [];

      // Show the unified toolbar instead of loose buttons
      toolbar.style.display = "flex";
    } catch (err) {
      console.error("[FeedbackWidget] Screenshot failed:", err);
      button.textContent = "Report Issue";
      button.disabled = false;
      document.body.style.overflow = "";
    }
  });

  // Drawing logic
  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    currentStroke = [];
    [lastX, lastY] = [e.offsetX, e.offsetY];
    currentStroke.push({ x: lastX, y: lastY });
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
    currentStroke.push({ x: lastX, y: lastY });
  });

  canvas.addEventListener("mouseup", () => {
    if (currentStroke.length > 0) strokes.push([...currentStroke]);
    isDrawing = false;
    currentStroke = [];
  });

  canvas.addEventListener("mouseleave", () => {
    if (currentStroke.length > 0) strokes.push([...currentStroke]);
    isDrawing = false;
    currentStroke = [];
  });

  // Toolbar Button Logic
  document.getElementById("fw-undo").addEventListener("click", () => {
    strokes.pop();
    redrawStrokes();
  });

  document.getElementById("fw-clear").addEventListener("click", () => {
    strokes = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  document.getElementById("fw-cancel-draw").addEventListener("click", () => {
    resetWidget();
  });

  document.getElementById("fw-done").addEventListener("click", () => {
    const mergedCanvas = document.createElement("canvas");
    mergedCanvas.width = document.documentElement.clientWidth;
    mergedCanvas.height = document.documentElement.clientHeight;
    const mergedCtx = mergedCanvas.getContext("2d");

    const bg = new Image();
    bg.onload = () => {
      mergedCtx.drawImage(bg, 0, 0);
      mergedCtx.drawImage(canvas, 0, 0);
      screenshotDataUrl = mergedCanvas.toDataURL("image/png");

      const preview = document.getElementById("fw-preview");
      preview.src = screenshotDataUrl;
      preview.style.display = "block";

      // Cleanup drawing view
      document.body.style.overflow = "";
      overlay.style.display = "none";
      toolbar.style.display = "none";

      // Show comment modal
      modal.style.display = "block";
    };
    bg.src = screenshotDataUrl;
  });

  function redrawStrokes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#EF4444";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    strokes.forEach((stroke) => {
      if (stroke.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    });
  }

  // ── Modal Actions ─────────────────────────────────────────────────────────
  document.addEventListener("click", (e) => {
    if (e.target.id === "fw-cancel-modal") resetWidget();
    if (e.target.id === "fw-submit") submitFeedback();
  });

  async function submitFeedback() {
    const comment = document.getElementById("fw-comment").value.trim();
    if (!comment) {
      alert("Please describe the issue");
      return;
    }

    const submitBtn = document.getElementById("fw-submit");
    submitBtn.textContent = "Sending...";
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
          <div style="text-align:center; padding: 30px 0">
            <div style="font-size:48px; color: #10b981; margin-bottom: 16px;">✓</div>
            <h3 style="margin: 0 0 8px 0; color: #18181b;">Report Sent!</h3>
            <p style="color:#71717a; margin: 0;">Thank you for your feedback.</p>
          </div>
        `;
        setTimeout(resetWidget, 2500);
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      alert("Failed to send report. Please try again.");
      submitBtn.textContent = "Send Report";
      submitBtn.disabled = false;
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  function resetWidget() {
    document.body.style.overflow = "";

    modal.style.display = "none";
    overlay.style.display = "none";
    toolbar.style.display = "none";

    screenshotDataUrl = null;
    strokes = [];
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

    button.textContent = "Report Issue";
    button.disabled = false;
    button.style.display = "block";

    modal.innerHTML = `
      <h3>Submit Feedback</h3>
      <p>Describe the issue you're experiencing</p>
      <img id="fw-preview" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
      <textarea id="fw-comment" placeholder="What exactly is broken?"></textarea>
      <div id="fw-actions">
        <button id="fw-cancel-modal">Cancel</button>
        <button id="fw-submit">Send Report</button>
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
