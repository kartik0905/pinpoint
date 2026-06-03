(function () {
  // ── Config ──────────────────────────────────────────────────────────────
  let script = document.currentScript;
  if (!script) {
    script =
      document.querySelector('script[src*="widget.js"]') ||
      document.querySelector("script[data-token]");
  }
  const token = script ? script.getAttribute("data-token") : null;
  const API_URL = "https://pinpoint-backend-cq9k.onrender.com/api/feedback";

  // THE TOGGLE SWITCHES
  const showButton = script
    ? script.getAttribute("data-button") !== "false"
    : true;
  const showContext = script
    ? script.getAttribute("data-context") === "true"
    : false;

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

    #fw-toolbar {
      position: fixed;
      top: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: #18181b; 
      padding: 8px 12px;
      border-radius: 100px;
      display: none; 
      align-items: center;
      gap: 12px;
      z-index: 9999999;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      font-family: system-ui, -apple-system, sans-serif;
    }

    #fw-toolbar span { color: #a1a1aa; font-size: 13px; font-weight: 500; margin: 0 8px; }
    .fw-tool-btn { background: rgba(255,255,255,0.1); color: white; border: none; padding: 8px 16px; border-radius: 100px; font-size: 13px; font-weight: 500; cursor: pointer; transition: background 0.2s; }
    .fw-tool-btn:hover { background: rgba(255,255,255,0.15); }
    .fw-btn-primary { background: #4F46E5 !important; }
    .fw-btn-primary:hover { background: #4338CA !important; }
    .fw-btn-danger { background: rgba(239, 68, 68, 0.15) !important; color: #fca5a5 !important; }
    .fw-btn-danger:hover { background: rgba(239, 68, 68, 0.25) !important; }

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
    #fw-comment { width: 100%; height: 90px; border: 1px solid #e4e4e7; border-radius: 12px; padding: 12px; font-size: 14px; resize: none; box-sizing: border-box; font-family: inherit; background: #fafafa; }
    #fw-comment:focus { outline: none; border-color: #4F46E5; background: white; }
    #fw-actions { display: flex; gap: 10px; margin-top: 16px; }
    #fw-submit { flex: 1; background: #4F46E5; color: white; border: none; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; }
    #fw-submit:hover { background: #4338CA; }
    #fw-submit:disabled { background: #a5b4fc; cursor: not-allowed; }
    #fw-cancel-modal { background: #f4f4f5; color: #3f3f46; border: none; padding: 12px 20px; border-radius: 10px; font-size: 14px; font-weight: 500; cursor: pointer; }
    #fw-cancel-modal:hover { background: #e4e4e7; }
    #fw-preview { width: 100%; border-radius: 8px; margin-bottom: 12px; border: 1px solid #e4e4e7; display: none; max-height: 120px; object-fit: cover; object-position: top; }

    #fw-context-menu {
      position: absolute;
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 8px;
      padding: 6px;
      min-width: 180px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      z-index: 9999999;
      display: none;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .fw-context-item { padding: 8px 12px; color: #e4e4e7; font-size: 13px; font-weight: 500; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: background 0.15s; }
    .fw-context-item:hover { background: #4F46E5; color: white; }
  `;

  const styleEl = document.createElement("style");
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // ── DOM Elements ─────────────────────────────────────────────────────────
  let button = null;
  if (showButton) {
    button = document.createElement("button");
    button.id = "fw-button";
    button.textContent = "Report Issue";
    document.body.appendChild(button);
  }

  const overlay = document.createElement("div");
  overlay.id = "fw-overlay";
  const canvas = document.createElement("canvas");
  canvas.id = "fw-canvas";
  overlay.appendChild(canvas);
  document.body.appendChild(overlay);

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

  let customMenu = null;
  if (showContext) {
    customMenu = document.createElement("div");
    customMenu.id = "fw-context-menu";
    customMenu.innerHTML = `
      <div class="fw-context-item" id="fw-context-report">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c-1.9.2-3.53 1.9-3.53 3.8"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/></svg>
        <span>🐞 Report an Issue</span>
      </div>
    `;
    document.body.appendChild(customMenu);
  }

  // ── State ─────────────────────────────────────────────────────────────────
  let screenshotDataUrl = null;
  let isDrawing = false;
  let ctx = null;
  let lastX = 0;
  let lastY = 0;
  let strokes = [];
  let currentStroke = [];

  // ── Screenshot + Draw Flow (Extracted) ────────────────────────────────────
  async function triggerCapture() {
    if (button) {
      button.textContent = "Capturing...";
      button.disabled = true;
    }

    try {
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js",
      );

      screenshotDataUrl = await htmlToImage.toPng(document.body, {
        pixelRatio: 1,
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        style: {
          transform: "none",
          margin: "0",
        },
        scrollY: window.scrollY,
        scrollX: window.scrollX,
        useCORS: true,
        allowTaint: true,
      });

      if (button) button.style.display = "none";
      document.body.style.overflow = "hidden";

      overlay.style.backgroundImage = `url(${screenshotDataUrl})`;
      overlay.style.backgroundSize = "100% 100%";
      overlay.style.backgroundRepeat = "no-repeat";
      overlay.style.backgroundPosition = "top left";
      overlay.style.display = "block";

      canvas.width = document.documentElement.clientWidth;
      canvas.height = document.documentElement.clientHeight;
      ctx = canvas.getContext("2d");
      ctx.strokeStyle = "#EF4444";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      strokes = [];
      currentStroke = [];

      toolbar.style.display = "flex";
    } catch (err) {
      console.error("[FeedbackWidget] Screenshot failed:", err);
      if (button) {
        button.textContent = "Report Issue";
        button.disabled = false;
        button.style.display = "block";
      }
      document.body.style.overflow = "";
    }
  }

  // Bind the Button
  if (button) {
    button.addEventListener("click", triggerCapture);
  }

  // Bind the Right-Click Menu
  if (customMenu) {
    window.addEventListener(
      "contextmenu",
      (e) => {
        if (!e.shiftKey) return;

        e.preventDefault();
        customMenu.style.display = "block";

        const menuWidth = customMenu.offsetWidth;
        const menuHeight = customMenu.offsetHeight;

        let x = e.pageX;
        let y = e.pageY;

        if (x + menuWidth > window.innerWidth + window.scrollX) x -= menuWidth;
        if (y + menuHeight > window.innerHeight + window.scrollY)
          y -= menuHeight;

        customMenu.style.left = `${x}px`;
        customMenu.style.top = `${y}px`;
      },
      { capture: true },
    );

    window.addEventListener(
      "click",
      () => {
        if (customMenu.style.display === "block") {
          customMenu.style.display = "none";
        }
      },
      { capture: true },
    );

    document
      .getElementById("fw-context-report")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        customMenu.style.display = "none";
        triggerCapture();
      });
  }

  // ── Drawing logic ─────────────────────────────────────────────────────────
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

      document.body.style.overflow = "";
      overlay.style.display = "none";
      toolbar.style.display = "none";

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

    if (button) {
      button.textContent = "Report Issue";
      button.disabled = false;
      button.style.display = "block";
    }

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
