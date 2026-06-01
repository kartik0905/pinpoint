import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Array of phrases for the Render-style typing animation
const typingPhrases = [
  "Now you will too.",
  "See exactly where.",
  "With visual proof.",
];

export default function Landing() {
  const [activeFaq, setActiveFaq] = useState(null);

  // Typing effect state
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize theme from localStorage, default to dark
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  // Typing Animation Logic
  useEffect(() => {
    const typeSpeed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      const fullText = typingPhrases[currentPhraseIndex];

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), 2500);
      } else if (isDeleting && currentText === "") {
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % typingPhrases.length);
      } else {
        setCurrentText(
          fullText.substring(0, currentText.length + (isDeleting ? -1 : 1)),
        );
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIndex]);

  // Render's specific color palette applied to the root
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (isDarkMode) {
      html.classList.add("dark");
      html.style.backgroundColor = "#0e1015";
      body.style.backgroundColor = "#0e1015";
      html.style.colorScheme = "dark";
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      html.style.backgroundColor = "#ffffff";
      body.style.backgroundColor = "#ffffff";
      html.style.colorScheme = "light";
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Is it safe to add a third-party script to my website?",
      a: "Yes. Pinpoint's widget is open source — every line of code is readable before you add it. The script only activates when a user deliberately clicks the Feedback button. It does not run in the background, does not access form inputs, and does not read cookies or localStorage. You can verify this yourself before deploying.",
    },
    {
      q: "What happens to my website if Pinpoint's servers go down?",
      a: "Nothing. The entire widget is wrapped in a try/catch block that fails silently. If our servers are unreachable, the Feedback button simply does not appear. Your website continues to load and function normally — no broken elements, no console errors visible to your users.",
    },
    {
      q: "Will this script affect my page load speed or Core Web Vitals?",
      a: "No. The script loads asynchronously and defers initialization until after your page's critical resources have loaded. It has zero impact on your main thread, LCP, or CLS scores. The html2canvas dependency is loaded on-demand only when a user clicks the Feedback button — not on page load.",
    },
    {
      q: "Can the widget's styles break my existing CSS?",
      a: "No. Every element Pinpoint injects into your DOM uses namespaced IDs prefixed with 'fw-' and scoped inline styles. Our styles cannot bleed into your components, and your stylesheets cannot override the widget's UI. The two are fully isolated.",
    },
    {
      q: "What if a screenshot captures a password field or sensitive input?",
      a: "Sensitive inputs are handled at the browser level before any data leaves the device. Standard HTML password fields (input type='password') are not captured by html2canvas by default. For additional protection, you can add a data-feedback-ignore attribute to any element and it will be excluded from the screenshot entirely.",
    },
    {
      q: "What data does Pinpoint actually collect?",
      a: "Only what the user explicitly submits: their comment, the screenshot they approved, the page URL, browser version, and device type. We do not scrape unsubmitted form data, track mouse movements, record keystrokes, or monitor user behaviour in any way outside of a feedback submission.",
    },
    {
      q: "Can someone use the widget to inject malicious code into my site?",
      a: "No. The widget sends data to Pinpoint's servers, not back into your website. All user input is stored as plain text in our database and sanitized before being rendered in your dashboard. There is no execution path from a feedback submission back into your website's DOM.",
    },
    {
      q: "Is Pinpoint compliant with GDPR and CCPA?",
      a: "Yes. Pinpoint does not use third-party tracking cookies, does not build user profiles, and does not share data with advertising networks. We only process data that a user voluntarily submits through the feedback form. No data is collected passively.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0e1015] text-zinc-900 dark:text-zinc-300 selection:bg-red-500/30 font-sans transition-colors duration-500">
      <style>{`
        html, body {
          background-color: ${isDarkMode ? "#0e1015" : "#ffffff"} !important;
        }

        /* Ambient Float */
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        /* --- FULL STORY ANIMATION SEQUENCE (14 seconds) --- */
        @keyframes cursorStory {
          0%, 5% { left: 5%; top: 15%; opacity: 0; }
          10% { opacity: 1; }
          20% { left: 85%; top: 82%; } /* 1. Move to Report Button */
          22% { left: 85%; top: 82%; } /* Click Report */
          30% { left: 78%; top: 38%; } /* 2. Move to Image */
          40% { left: 78%; top: 38%; } /* Draw Circle (Hold) */
          48% { left: 70%; top: 58%; } /* 3. Move to Textarea */
          62% { left: 70%; top: 58%; } /* Type text (Hold) */
          68% { left: 80%; top: 80%; } /* 4. Move to Submit Button */
          72% { left: 80%; top: 80%; } /* Click Submit */
          76% { left: 80%; top: 80%; opacity: 0; } /* Fade out */
          100% { left: 5%; top: 15%; opacity: 0; }
        }

        /* Adjusted to hide the button while the success message is shown */
        @keyframes btnClickStory {
          0%, 20% { transform: scale(1); opacity: 1; }
          22% { transform: scale(0.92); opacity: 1; }
          24%, 74% { transform: scale(1); opacity: 1; }
          75%, 95% { opacity: 0; transform: scale(1); } /* Button vanishes */
          96%, 100% { opacity: 1; transform: scale(1); } /* Button reappears */
        }

        @keyframes overlayStory {
          0%, 20% { opacity: 0; }
          25%, 90% { opacity: 1; }
          95%, 100% { opacity: 0; }
        }

        @keyframes drawStory {
          0%, 30% { stroke-dashoffset: 300; opacity: 0; }
          32% { opacity: 1; }
          40%, 90% { stroke-dashoffset: 0; opacity: 1; }
          95%, 100% { opacity: 0; stroke-dashoffset: 300; }
        }

        @keyframes formAppear {
          0%, 42% { opacity: 0; transform: translateY(10px); pointer-events: none; }
          45%, 72% { opacity: 1; transform: translateY(0); pointer-events: auto; }
          75%, 100% { opacity: 0; transform: translateY(10px); pointer-events: none; }
        }

        /* Tightly wrapping width to text length (22ch covers "Image is broken here.") */
        @keyframes typeText {
          0%, 50% { width: 0ch; }
          60%, 100% { width: 22ch; }
        }

        @keyframes submitClickStory {
          0%, 70% { transform: scale(1); }
          72% { transform: scale(0.95); }
          74%, 100% { transform: scale(1); }
        }

        @keyframes successAppear {
          0%, 73% { opacity: 0; transform: scale(0.95); pointer-events: none; }
          76%, 90% { opacity: 1; transform: scale(1); pointer-events: auto; }
          95%, 100% { opacity: 0; transform: scale(0.95); pointer-events: none; }
        }

        .animate-float-card { animation: floatCard 6s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulseSlow 4s ease-in-out infinite; }
        
        /* Applied Story Classes (14s loop) */
        .story-cursor { animation: cursorStory 14s infinite ease-in-out; }
        .story-btn-main { animation: btnClickStory 14s infinite ease-in-out; }
        .story-overlay { animation: overlayStory 14s infinite; }
        .story-draw { stroke-dasharray: 300; stroke-dashoffset: 300; animation: drawStory 14s infinite ease-out; }
        .story-form { animation: formAppear 14s infinite ease-in-out forwards; }
        .story-type { animation: typeText 14s infinite steps(21, end); }
        .story-submit { animation: submitClickStory 14s infinite ease-in-out; }
        .story-success { animation: successAppear 14s infinite ease-in-out forwards; }
      `}</style>

      {/* Full-width Sticky Navbar */}
      <div className="fixed top-0 w-full z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-[#0e1015]/80 backdrop-blur-md transition-colors duration-500">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/favicon.svg"
              alt="Pinpoint Logo"
              className="w-7 h-7 transition-transform group-hover:scale-110 duration-500"
            />
            <span className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight transition-colors duration-500">
              Pinpoint
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all focus:outline-none"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
            <Link
              to="/login"
              className="hidden sm:block text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
            >
              Log in
            </Link>

            <Link
              to="/register"
              className="group text-sm bg-zinc-900 dark:bg-white text-white dark:text-black px-5 py-2 rounded-md font-bold transition-all shadow-md"
            >
              <span className="bg-gradient-to-r from-white to-white dark:from-black dark:to-black group-hover:from-red-500 group-hover:to-orange-500 text-transparent bg-clip-text transition-all duration-300">
                Get Started
              </span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Render-Style Split Screen Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-32 md:pt-48 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & CTA */}
          <div className="text-center lg:text-left flex flex-col justify-center min-h-[300px]">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-zinc-900 dark:text-white tracking-tighter leading-[1.1] mb-6 transition-colors duration-500 min-h-[160px] sm:min-h-[180px] md:min-h-[220px]">
              Your users know what's broken. <br />
              {/* Animated Typing Text - Red/Orange Gradient */}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 dark:from-red-400 dark:via-rose-400 dark:to-orange-400">
                {currentText}
              </span>
              <span className="text-zinc-900 dark:text-white font-light animate-pulse ml-1">
                |
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed transition-colors duration-500 font-medium">
              Stop asking "what browser are you using?" Let users highlight
              exactly what's wrong with a screenshot, a drawing, and a comment.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-8 py-4 rounded-md text-base font-bold transition-all shadow-lg shadow-red-500/25"
              >
                Get Your Script Tag
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Animation */}
          <div className="relative w-full max-w-lg mx-auto lg:max-w-full mt-10 lg:mt-0">
            {/* Red/Orange Neon Glow anchoring the browser window */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-red-500/10 to-orange-500/10 dark:from-red-600/20 dark:to-orange-600/20 blur-[80px] rounded-full pointer-events-none -z-10"></div>

            {/* Canvas Container */}
            <div className="relative w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#15171e] shadow-2xl overflow-hidden text-left transition-colors duration-500 animate-float-card">
              {/* Browser Header */}
              <div className="flex items-center px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50 dark:bg-[#0e1015] transition-colors duration-500">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400 dark:bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500"></div>
                </div>
                <div className="mx-auto bg-white dark:bg-[#1a1c23] border border-zinc-200 dark:border-zinc-700/50 rounded flex items-center gap-2 px-10 sm:px-16 py-1 text-xs text-zinc-400 font-mono transition-colors duration-500">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                  yoursite.com
                </div>
              </div>

              {/* Browser Body & Animation container */}
              <div className="relative h-[300px] sm:h-[350px] bg-white dark:bg-[#15171e] p-6 sm:p-8 overflow-hidden transition-colors duration-500">
                {/* Fake Website Wireframe - Left Content */}
                <div className="w-7/12 sm:w-2/3 flex flex-col gap-4 sm:gap-6">
                  <div className="w-1/2 h-4 sm:h-6 bg-zinc-100 dark:bg-zinc-800 rounded"></div>
                  <div className="w-full h-24 sm:h-32 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg"></div>
                  <div className="w-5/6 h-3 sm:h-4 bg-zinc-100 dark:bg-zinc-800 rounded"></div>
                  <div className="w-4/6 h-3 sm:h-4 bg-zinc-100 dark:bg-zinc-800 rounded"></div>
                </div>

                {/* The Target Card */}
                <div className="absolute right-6 sm:right-8 top-12 sm:top-16 w-[35%] sm:w-1/4 h-24 sm:h-32 bg-red-50 dark:bg-red-900/10 border-2 border-dashed border-red-300 dark:border-red-900/50 rounded-lg flex items-center justify-center overflow-visible">
                  <span className="text-red-500 dark:text-red-500 text-[10px] sm:text-xs font-mono font-bold tracking-wider">
                    Failed Image
                  </span>

                  {/* Circle overlay inside target */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible scale-125"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <ellipse
                      className="story-draw"
                      cx="50"
                      cy="50"
                      rx="40"
                      ry="28"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Widget Dark Overlay */}
                <div className="absolute inset-0 bg-black/5 dark:bg-black/40 story-overlay opacity-0 pointer-events-none z-10"></div>

                {/* Step 1: Initial Button */}
                <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-8 bg-red-600 text-white px-4 py-2 sm:px-5 sm:py-3 rounded-md text-xs sm:text-sm font-bold shadow-lg shadow-red-500/30 flex items-center gap-2 story-btn-main z-20 origin-center">
                  Report Issue
                </div>

                {/* Step 2: The Feedback Form Popup */}
                <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 w-56 sm:w-64 bg-white dark:bg-[#1a1c23] border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-2xl p-4 z-40 story-form opacity-0">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] sm:text-xs font-bold text-zinc-900 dark:text-white">
                      Submit Feedback
                    </span>
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  </div>

                  {/* Textarea Simulator (Tight Wrapping Fix Applied Here) */}
                  <div className="w-full h-12 sm:h-16 bg-zinc-50 dark:bg-[#0e1015] rounded border border-zinc-200 dark:border-zinc-800 p-2 mb-3">
                    <div className="story-type overflow-hidden whitespace-nowrap border-r-2 border-zinc-400 dark:border-zinc-500 inline-block h-full">
                      <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">
                        Image is broken here.
                      </span>
                    </div>
                  </div>

                  <div className="w-full py-2 bg-red-600 rounded text-center text-white text-[10px] sm:text-xs font-bold story-submit origin-center">
                    Send Report
                  </div>
                </div>

                {/* Step 3: Success Confirmation */}
                <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 w-56 sm:w-64 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg shadow-2xl p-6 z-40 story-success opacity-0 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center mb-2 shadow-lg shadow-emerald-500/30">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 tracking-wide">
                    Sent Successfully
                  </span>
                </div>

                {/* The Floating Mouse Tracker Component */}
                <svg
                  className="absolute w-5 h-5 sm:w-6 sm:h-6 text-zinc-900 dark:text-white drop-shadow-md story-cursor z-50 pointer-events-none"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="white"
                  strokeWidth="1"
                >
                  <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L5.5 3.21z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Script tag preview */}
      <section className="max-w-5xl mx-auto px-6 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-zinc-50 dark:bg-[#15171e] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xl transition-colors duration-500">
            <div className="flex items-center px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-[#0e1015] transition-colors duration-500">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-zinc-700"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400 dark:bg-zinc-700"></div>
                <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-zinc-700"></div>
              </div>
              <span className="ml-4 text-xs font-mono font-bold text-zinc-500">
                index.html
              </span>
            </div>
            <div className="p-6 overflow-x-auto">
              <code className="text-sm font-mono leading-loose whitespace-nowrap text-zinc-800 dark:text-zinc-300">
                <span className="text-zinc-400 dark:text-zinc-600">
                  &lt;!-- Drop this in your body --&gt;
                </span>
                <br />
                <span className="text-pink-600 dark:text-pink-400">
                  &lt;script
                </span>
                <br />
                &nbsp;&nbsp;
                <span className="text-blue-500 dark:text-blue-400">src</span>=
                <span className="text-emerald-600 dark:text-emerald-300">
                  "https://pinpoint.io/widget.js"
                </span>
                <br />
                &nbsp;&nbsp;
                <span className="text-blue-500 dark:text-blue-400">
                  data-token
                </span>
                =
                <span className="text-emerald-600 dark:text-emerald-300">
                  "pk_live_..."
                </span>
                <br />
                <span className="text-pink-600 dark:text-pink-400">
                  &gt;&lt;/script&gt;
                </span>
              </code>
            </div>
          </div>

          {/* Abstract UI Output */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center text-zinc-300 dark:text-zinc-700 animate-bounce-x">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
            <div className="relative w-full h-48 bg-zinc-100 dark:bg-[#15171e] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-inner transition-colors duration-500">
              <div className="absolute top-4 left-4 right-4 h-4 bg-zinc-200 dark:bg-zinc-800 rounded transition-colors duration-500"></div>
              <div className="absolute top-12 left-4 w-1/2 h-16 bg-zinc-200 dark:bg-zinc-800 rounded transition-colors duration-500"></div>
              <div className="absolute top-12 right-4 w-1/3 h-16 bg-zinc-200 dark:bg-zinc-800 rounded transition-colors duration-500"></div>

              {/* Floating Widget Output */}
              <div className="absolute bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-md text-xs font-bold shadow-lg shadow-red-500/30 flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Report Issue
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Bento Box Features */}
      <section className="max-w-6xl mx-auto px-6 py-24 relative z-10">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight transition-colors duration-500">
            Everything you need.
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 font-medium">
            Built for developers to fix bugs faster.
          </p>
        </div>

        {/* Updated grid layout allowing tickets to grow freely */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(320px,auto)]">
          {/* Large Card 1: Visual annotations */}
          <div className="md:col-span-2 bg-white dark:bg-[#15171e] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 flex flex-col hover:border-red-300 dark:hover:border-zinc-600 transition-all shadow-sm dark:shadow-none overflow-hidden group">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 relative z-10 tracking-tight">
              Visual Annotations
            </h3>
            <span className="text-zinc-600 dark:text-zinc-400 relative z-10 mb-6 font-medium">
              Users draw directly on the screen to prove it.
            </span>

            {/* Syncing the story: Using the "Failed Image" visual context */}
            <div className="flex-1 bg-zinc-50 dark:bg-[#0e1015] rounded-xl relative border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-500">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-[#1a1c23] border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-white text-[11px] font-bold px-4 py-2 rounded-md flex gap-4 items-center shadow-lg z-20 transition-colors duration-500">
                <span className="text-zinc-500 dark:text-zinc-400">Cancel</span>
                <span className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded">
                  Undo
                </span>
                <span className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1 rounded">
                  Clear
                </span>
                <span className="bg-red-600 text-white px-3 py-1 rounded">
                  Done
                </span>
              </div>

              <div className="absolute inset-0 p-8 pt-20 flex justify-center opacity-80">
                <div className="w-1/3 h-24 bg-red-50 dark:bg-red-900/10 border-2 border-dashed border-red-300 dark:border-red-900/50 rounded-lg flex items-center justify-center">
                  <span className="text-red-500 dark:text-red-500 text-[10px] font-mono font-bold">
                    Failed Image
                  </span>
                </div>
              </div>

              <svg
                className="absolute inset-0 w-full h-full z-10"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M 35,70 Q 50,45 65,70 T 85,90"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Small Card 1: Auto-Screenshots */}
          <div className="md:col-span-1 bg-white dark:bg-[#15171e] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 flex flex-col hover:border-red-300 dark:hover:border-zinc-600 transition-all shadow-sm dark:shadow-none overflow-hidden group">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 relative z-10 tracking-tight">
              Auto-Screenshots
            </h3>
            <span className="text-zinc-600 dark:text-zinc-400 relative z-10 font-medium">
              Exact DOM state captured.
            </span>

            <div className="flex-1 relative mt-6 flex items-center justify-center">
              <div className="absolute w-32 h-24 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg opacity-40 rotate-[-15deg] transition-transform group-hover:rotate-[-20deg]"></div>
              <div className="absolute w-32 h-24 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg opacity-80 rotate-[-5deg] animate-layer"></div>
              <div className="absolute w-32 h-24 bg-white dark:bg-[#1a1c23] border border-red-300 dark:border-red-500/50 rounded-lg flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                <span className="text-sm font-bold font-mono text-red-600 dark:text-red-400 px-3 py-1 border border-red-200 dark:border-red-500/50 rounded">
                  .PNG
                </span>
              </div>
            </div>
          </div>

          {/* Small Card 2: Environment Data */}
          <div className="md:col-span-1 bg-white dark:bg-[#15171e] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 flex flex-col hover:border-red-300 dark:hover:border-zinc-600 transition-all shadow-sm dark:shadow-none overflow-hidden">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 relative z-10 tracking-tight">
              Environment Data
            </h3>
            <div className="flex-1 bg-zinc-50 dark:bg-[#0e1015] rounded-xl p-5 font-mono text-[13px] leading-loose border border-zinc-200 dark:border-zinc-800 transition-colors duration-500 overflow-hidden">
              <span className="text-pink-600 dark:text-pink-400">const</span>{" "}
              <span className="text-blue-500 dark:text-blue-400">env</span>{" "}
              <span className="text-zinc-800 dark:text-white">=</span>{" "}
              <span className="text-zinc-800 dark:text-white">{"{"}</span>{" "}
              <br />
              <div className="animate-pulse-slow">
                &nbsp;&nbsp;
                <span className="text-zinc-800 dark:text-zinc-300">
                  os:
                </span>{" "}
                <span className="text-emerald-600 dark:text-emerald-300">
                  "macOS"
                </span>
                ,<br />
                &nbsp;&nbsp;
                <span className="text-zinc-800 dark:text-zinc-300">
                  browser:
                </span>{" "}
                <span className="text-emerald-600 dark:text-emerald-300">
                  "Chrome"
                </span>
                ,<br />
                &nbsp;&nbsp;
                <span className="text-zinc-800 dark:text-zinc-300">
                  screen:
                </span>{" "}
                <span className="text-emerald-600 dark:text-emerald-300">
                  "1440x900"
                </span>
                <br />
              </div>
              <span className="text-zinc-800 dark:text-white">{"}"};</span>
            </div>
          </div>

          {/* Large Card 2: Real-time Dashboard */}
          <div className="md:col-span-2 bg-white dark:bg-[#15171e] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 flex flex-col hover:border-red-300 dark:hover:border-zinc-600 transition-all shadow-sm dark:shadow-none overflow-hidden group">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 relative z-10 tracking-tight">
              Real-time Dashboard
            </h3>
            <span className="text-zinc-600 dark:text-zinc-400 relative z-10 mb-6 font-medium">
              Watch tickets drop into your Kanban board instantly.
            </span>

            <div className="flex-1 bg-zinc-50 dark:bg-[#0e1015] rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 flex gap-3 transition-colors duration-500">
              {/* TO DO Column */}
              <div className="flex-1 bg-zinc-100/50 dark:bg-[#15171e] rounded-lg border border-zinc-200/50 dark:border-zinc-800 p-2 sm:p-3 flex flex-col gap-2.5 transition-colors duration-500">
                <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 tracking-wider flex items-center justify-between px-1">
                  TODO{" "}
                  <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-1.5 py-0.5 rounded text-[8px]">
                    2
                  </span>
                </div>

                {/* The Submitted Story Ticket */}
                <div className="bg-white dark:bg-[#1a1c23] p-2.5 sm:p-3 rounded-md border border-red-200 dark:border-red-500/30 animate-ticket shadow-sm transition-colors duration-500 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wide">
                      BUG
                    </span>
                    <span className="text-[9px] font-mono text-zinc-400">
                      #1042
                    </span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-zinc-800 dark:text-white mb-2 leading-tight">
                    Image is broken here.
                  </div>

                  {/* Miniature Snapshot matching the hero */}
                  <div className="w-full h-8 sm:h-10 bg-zinc-50 dark:bg-[#0e1015] rounded border border-zinc-200 dark:border-zinc-800 mb-2 flex items-center justify-center overflow-hidden">
                    <div className="w-1/2 h-full bg-red-500/10 border border-red-500/20 rounded-sm m-1 flex items-center justify-center">
                      <span className="text-[5px] text-red-500 font-bold leading-none">
                        FAILED
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                    <span className="text-[8px] sm:text-[9px]">macOS</span>
                    <span className="text-[8px] sm:text-[9px]">Chrome</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1a1c23] p-2.5 sm:p-3 rounded-md border border-zinc-200 dark:border-zinc-700/50 shadow-sm transition-colors duration-500 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wide">
                      API
                    </span>
                    <span className="text-[9px] font-mono text-zinc-400">
                      #1041
                    </span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-zinc-800 dark:text-white mb-2 leading-tight">
                    500 Error on Checkout
                  </div>
                </div>
              </div>

              {/* IN PROGRESS Column */}
              <div className="flex-1 bg-zinc-100/50 dark:bg-[#15171e] rounded-lg border border-zinc-200/50 dark:border-zinc-800 p-2 sm:p-3 flex flex-col gap-2.5 transition-colors duration-500">
                <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 tracking-wider flex items-center justify-between px-1">
                  IN PROGRESS{" "}
                  <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-1.5 py-0.5 rounded text-[8px]">
                    1
                  </span>
                </div>
                <div className="bg-white dark:bg-[#1a1c23] p-2.5 sm:p-3 rounded-md border border-zinc-200 dark:border-zinc-700/50 shadow-sm transition-colors duration-500 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wide">
                      UI/UX
                    </span>
                    <span className="text-[9px] font-mono text-zinc-400">
                      #1038
                    </span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-zinc-800 dark:text-white mb-2 leading-tight">
                    Navbar overlaps on mobile
                  </div>
                </div>
              </div>

              {/* DONE Column */}
              <div className="flex-1 bg-zinc-100/50 dark:bg-[#15171e] rounded-lg border border-zinc-200/50 dark:border-zinc-800 p-2 sm:p-3 flex flex-col gap-2.5 transition-colors duration-500">
                <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 tracking-wider flex items-center justify-between px-1">
                  DONE{" "}
                  <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-1.5 py-0.5 rounded text-[8px]">
                    1
                  </span>
                </div>
                <div className="bg-white dark:bg-[#1a1c23] p-2.5 sm:p-3 rounded-md border border-zinc-200 dark:border-zinc-700/50 shadow-sm transition-colors duration-500 relative overflow-hidden opacity-60">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wide">
                      TEXT
                    </span>
                    <span className="text-[9px] font-mono text-zinc-400">
                      #1021
                    </span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-zinc-800 dark:text-white mb-2 leading-tight line-through decoration-zinc-500">
                    Update pricing copy
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Design */}
      <section className="py-24 relative z-10 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight transition-colors duration-500">
              Built defensively.
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 font-medium transition-colors duration-500">
              Security & Performance Details
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#15171e] border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-zinc-50 dark:hover:bg-[#1a1c23] transition-colors"
                >
                  <h3
                    className={`font-bold pr-8 text-lg transition-colors ${activeFaq === index ? "text-red-600 dark:text-red-400" : "text-zinc-900 dark:text-zinc-200"}`}
                  >
                    {faq.q}
                  </h3>
                  <span
                    className={`text-xl font-bold transition-transform duration-300 ${activeFaq === index ? "rotate-45 text-red-500" : "text-zinc-400"}`}
                  >
                    +
                  </span>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out ${
                    activeFaq === index
                      ? "max-h-[500px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-6 pt-0 text-zinc-600 dark:text-zinc-400 leading-relaxed text-base font-medium">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative z-10 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0e1015]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-extrabold text-zinc-900 dark:text-white mb-6 tracking-tight transition-colors duration-500">
            Ready to fix bugs faster?
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 font-medium">
            Join thousands of developers who have stopped asking "what browser
            are you using?"
          </p>
          <Link
            to="/register"
            className="inline-block bg-zinc-900 dark:bg-white text-white dark:text-black px-10 py-4 rounded-md text-lg font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-xl"
          >
            Get started for free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12 bg-white dark:bg-[#0e1015] relative z-10 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="Pinpoint Logo" className="w-6 h-6" />
            <span className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight transition-colors duration-500">
              Pinpoint
            </span>
          </div>

          {/* Middle: Copyright */}
          <span className="text-sm font-semibold text-zinc-500 text-center">
            © 2026 Pinpoint. Built by Kartik Garg.
          </span>

          {/* Right: Contact & Socials */}
          <div className="flex items-center gap-6">
            <a
              href="mailto:kartikamitgarg2005@gmail.com"
              className="text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-2 text-sm font-semibold"
              aria-label="Email Contact"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span className="hidden sm:inline">Contact</span>
            </a>

            <a
              href="https://github.com/kartik0905"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              aria-label="GitHub Profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
