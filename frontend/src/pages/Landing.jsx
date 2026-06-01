import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  const [activeFaq, setActiveFaq] = useState(null);

  // Initialize theme from localStorage, default to dark
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  // Bulletproof fix for the Mac Overscroll "White Bar"
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (isDarkMode) {
      html.classList.add("dark");
      html.style.backgroundColor = "#18181b"; // Matches Tailwind's zinc-900
      body.style.backgroundColor = "#18181b";
      html.style.colorScheme = "dark"; // Fixes native scrollbar colors
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      html.style.backgroundColor = "#fafafa"; // Matches Tailwind's zinc-50
      body.style.backgroundColor = "#fafafa";
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
    <div className="min-h-screen bg-zinc-200 dark:bg-[#09090b] p-2 md:p-4 transition-colors duration-500 flex flex-col">
      <div className="relative flex-1 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] md:rounded-[2.5rem] border border-white/50 dark:border-zinc-800/50 shadow-2xl overflow-hidden text-zinc-600 dark:text-zinc-300 selection:bg-cyan-500/30 font-sans transition-colors duration-500">
        <style>{`
          /* Global override to ensure the browser's root canvas matches your theme */
          html, body {
            background-color: ${isDarkMode ? "#18181b" : "#fafafa"} !important;
          }

          /* Animation Keyframes */
          @keyframes floatCard {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
          }
          @keyframes cursorMove {
            0% { transform: translate(0px, 0px); opacity: 0; }
            10% { opacity: 1; transform: translate(50px, 50px); }
            25% { transform: translate(620px, 260px); } /* Hover button */
            30% { transform: translate(620px, 260px) scale(0.85); } /* Click button */
            40% { transform: translate(450px, 120px) scale(1); } /* Move to broken image */
            50%, 80% { transform: translate(450px, 120px); } /* Hold while drawing */
            90% { transform: translate(450px, 120px); opacity: 1; }
            100% { transform: translate(450px, 120px); opacity: 0; }
          }
          @keyframes buttonPress {
            0%, 25% { transform: scale(1); }
            28% { transform: scale(0.92); box-shadow: 0 0 0 rgba(79,70,229,0); }
            32%, 100% { transform: scale(1); }
          }
          @keyframes fadeOverlay {
            0%, 28% { opacity: 0; }
            30%, 90% { opacity: 1; }
            95%, 100% { opacity: 0; }
          }
          @keyframes drawCircle {
            0%, 40% { stroke-dashoffset: 300; opacity: 0; }
            45% { opacity: 1; }
            60%, 90% { stroke-dashoffset: 0; opacity: 1; }
            95%, 100% { opacity: 0; stroke-dashoffset: 0; }
          }
          @keyframes floatLayer {
            0%, 100% { transform: translateY(0) rotate(-10deg); }
            50% { transform: translateY(-10px) rotate(-10deg); }
          }
          @keyframes slideInTicket {
            0%, 20% { opacity: 0; transform: translateY(-20px); }
            30%, 80% { opacity: 1; transform: translateY(0); }
            90%, 100% { opacity: 0; transform: translateX(20px); }
          }
          @keyframes bounceHorizontal {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(5px); }
          }
          .animate-float-card { animation: floatCard 6s ease-in-out infinite; }
          .animate-cursor { animation: cursorMove 6s infinite ease-in-out; }
          .animate-button { animation: buttonPress 6s infinite ease-in-out; }
          .animate-overlay { animation: fadeOverlay 6s infinite; }
          .animate-draw { 
            stroke-dasharray: 300; 
            stroke-dashoffset: 300; 
            animation: drawCircle 6s infinite ease-out; 
          }
          .animate-layer { animation: floatLayer 4s infinite ease-in-out; }
          .animate-ticket { animation: slideInTicket 5s infinite ease-out; }
          .animate-bounce-x { animation: bounceHorizontal 1.5s infinite; }
        `}</style>

        {/* Background Ambient Glows */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-cyan-400/20 to-purple-400/20 dark:from-cyan-500/20 dark:to-purple-600/20 blur-[120px] rounded-full pointer-events-none -z-10 transition-colors duration-500"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-t from-blue-400/10 to-cyan-400/10 dark:from-blue-600/10 dark:to-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10 transition-colors duration-500"></div>

        {/* Floating Glass Navbar */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-5xl z-50">
          <nav className="bg-white/80 dark:bg-zinc-800/60 backdrop-blur-xl border border-zinc-200 dark:border-zinc-700/50 rounded-full px-6 py-3 flex justify-between items-center shadow-lg shadow-zinc-200/50 dark:shadow-2xl transition-all duration-500">
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src="/favicon.svg"
                alt="Pinpoint Logo"
                className="w-7 h-7 transition-transform group-hover:scale-110 duration-500"
              />
              <span className="text-xl font-bold font-serif text-zinc-900 dark:text-white tracking-tight transition-colors duration-500">
                Pinpoint
              </span>
            </Link>
            <div className="flex items-center gap-4 md:gap-6">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-700/50 transition-all focus:outline-none"
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
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm bg-zinc-900 dark:bg-white text-white dark:text-black px-5 py-2 rounded-full font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-md dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="max-w-5xl mx-auto px-6 pt-40 pb-20 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-serif text-zinc-900 dark:text-white leading-[1.05] mb-6 transition-colors duration-500">
            Your users know what's broken. <br />
            <span className="text-transparent font-sans font-bold bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 tracking-tighter">
              Now you will too.
            </span>
          </h1>

          <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed transition-colors duration-500">
            Stop asking "what browser are you using?" Let users highlight
            exactly what's wrong with a screenshot, a drawing, and a comment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-500 dark:to-blue-600 text-white px-8 py-4 rounded-full text-base font-semibold hover:from-cyan-500 hover:to-blue-500 dark:hover:from-cyan-400 dark:hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/30 dark:shadow-[0_0_30px_rgba(8,145,178,0.3)] transform hover:-translate-y-0.5"
            >
              Start building for free
            </Link>
          </div>

          {/* The Visual Animated Browser Window - NOW WITH animate-float-card */}
          <div className="relative max-w-3xl mx-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden text-left transition-colors duration-500 animate-float-card">
            {/* Browser Header */}
            <div className="flex items-center px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 transition-colors duration-500">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400 dark:bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500"></div>
              </div>
              <div className="mx-auto bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-16 py-1 text-xs text-zinc-400 font-mono flex items-center gap-2 transition-colors duration-500">
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
            <div className="relative h-[350px] bg-white dark:bg-zinc-950 p-8 overflow-hidden transition-colors duration-500">
              {/* Fake Website Wireframe */}
              <div className="w-1/3 h-6 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-6"></div>
              <div className="flex gap-6">
                <div className="w-2/3 space-y-4">
                  <div className="w-full h-24 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl"></div>
                  <div className="w-5/6 h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full"></div>
                  <div className="w-4/6 h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full"></div>
                </div>
                {/* The "Broken" Element */}
                <div className="w-1/3 h-40 bg-red-50 dark:bg-red-900/20 border-2 border-dashed border-red-300 dark:border-red-800 rounded-xl flex items-center justify-center">
                  <span className="text-red-500 dark:text-red-500 text-xs font-mono">
                    Image Failed
                  </span>
                </div>
              </div>

              {/* Widget Dark Overlay (Fades in when button is clicked) */}
              <div className="absolute inset-0 bg-black/5 dark:bg-black/40 animate-overlay opacity-0 pointer-events-none z-10"></div>

              {/* The Feedback Button Component */}
              <div className="absolute bottom-6 right-6 bg-indigo-600 text-white px-5 py-3 rounded-full text-sm font-semibold shadow-[0_4px_14px_rgba(79,70,229,0.4)] flex items-center gap-2 animate-button z-20 origin-center">
                Report Issue
              </div>

              {/* Animated SVG Draw Line (The red circle over the broken image) */}
              <svg
                className="absolute top-8 right-8 w-48 h-48 pointer-events-none z-30"
                viewBox="0 0 100 100"
              >
                <path
                  className="animate-draw"
                  d="M 20,50 C 20,20 80,20 80,50 C 80,80 20,80 20,50"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>

              {/* The Mouse Cursor */}
              <svg
                className="absolute top-8 left-8 w-6 h-6 text-zinc-900 dark:text-white drop-shadow-md animate-cursor z-50 pointer-events-none"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="white"
                strokeWidth="1"
              >
                <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L5.5 3.21z" />
              </svg>
            </div>
          </div>
        </section>

        {/* Script tag preview (Split Screen) */}
        <section className="max-w-5xl mx-auto px-6 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left: Code Editor */}
            <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-700/50 rounded-2xl p-1 shadow-2xl shadow-indigo-200/50 dark:shadow-2xl transition-colors duration-500">
              <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl overflow-hidden transition-colors duration-500">
                <div className="flex items-center px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 transition-colors duration-500">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400 border border-green-500/20"></div>
                  </div>
                  <span className="ml-4 text-xs font-mono text-zinc-500 dark:text-zinc-500">
                    index.html
                  </span>
                </div>
                <div className="p-6 overflow-x-auto bg-zinc-50 dark:bg-[#18181b] transition-colors duration-500">
                  <code className="text-sm font-mono leading-loose whitespace-nowrap text-zinc-800 dark:text-white">
                    <span className="text-zinc-400 dark:text-zinc-500">
                      &lt;!-- Drop this in your body --&gt;
                    </span>
                    <br />
                    <span className="text-pink-600 dark:text-pink-400">
                      &lt;script
                    </span>
                    <br />
                    &nbsp;&nbsp;
                    <span className="text-cyan-600 dark:text-cyan-300">
                      src
                    </span>
                    =
                    <span className="text-amber-600 dark:text-yellow-200">
                      "https://pinpoint.io/widget.js"
                    </span>
                    <br />
                    &nbsp;&nbsp;
                    <span className="text-cyan-600 dark:text-cyan-300">
                      data-token
                    </span>
                    =
                    <span className="text-amber-600 dark:text-yellow-200">
                      "pk_live_..."
                    </span>
                    <br />
                    <span className="text-pink-600 dark:text-pink-400">
                      &gt;&lt;/script&gt;
                    </span>
                  </code>
                </div>
              </div>
            </div>

            {/* Right: Abstract UI Output */}
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center text-zinc-400 dark:text-zinc-500 animate-bounce-x">
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
              <div className="relative w-full h-48 bg-zinc-200/50 dark:bg-zinc-800/30 border border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden shadow-inner transition-colors duration-500">
                <div className="absolute top-4 left-4 right-4 h-4 bg-zinc-300 dark:bg-zinc-700/50 rounded-full transition-colors duration-500"></div>
                <div className="absolute top-10 left-4 w-1/2 h-20 bg-zinc-300 dark:bg-zinc-700/50 rounded-lg transition-colors duration-500"></div>
                <div className="absolute top-10 right-4 w-1/3 h-20 bg-zinc-300 dark:bg-zinc-700/50 rounded-lg transition-colors duration-500"></div>

                {/* Floating Widget Output */}
                <div className="absolute bottom-3 right-3 bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg shadow-indigo-500/50 flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  Report Issue
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Bento Box Features */}
        <section className="max-w-6xl mx-auto px-6 py-24 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-zinc-900 dark:text-white mb-4 transition-colors duration-500">
              Everything you need.{" "}
              <span className="text-zinc-500 dark:text-zinc-600 italic">
                Nothing you don't.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Large Card 1: Visual annotations */}
            <div className="md:col-span-2 bg-white dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/50 rounded-3xl p-6 flex flex-col hover:border-indigo-200 dark:hover:border-zinc-600/80 transition-all shadow-xl shadow-indigo-100/50 dark:shadow-none overflow-hidden group">
              <h3 className="text-xl font-serif text-zinc-900 dark:text-white mb-1 relative z-10">
                Visual Annotations
              </h3>
              <span className="text-sm text-zinc-500 relative z-10 mb-4">
                Users draw directly on the screen to prove it.
              </span>

              {/* Visual Toolbar UI */}
              <div className="flex-1 bg-zinc-50 dark:bg-zinc-900/80 rounded-xl relative border border-zinc-200 dark:border-zinc-700 overflow-hidden transition-colors duration-500">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-white text-[10px] px-3 py-1.5 rounded-full flex gap-3 items-center shadow-lg z-20 transition-colors duration-500">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    ✕ Cancel
                  </span>
                  <span className="bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-white px-2 py-0.5 rounded-full">
                    Undo
                  </span>
                  <span className="bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
                    Clear
                  </span>
                  <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                    ✓ Done
                  </span>
                </div>
                <div className="absolute inset-0 p-6 flex flex-col gap-3 opacity-40">
                  <div className="w-full h-8 bg-zinc-200 dark:bg-zinc-700 rounded-md transition-colors duration-500"></div>
                  <div className="w-3/4 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-md transition-colors duration-500"></div>
                </div>
                <svg
                  className="absolute inset-0 w-full h-full z-10"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 10,40 Q 50,20 80,40 T 90,70"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Small Card 1: Auto-Screenshots */}
            <div className="md:col-span-1 bg-white dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/50 rounded-3xl p-6 flex flex-col hover:border-indigo-200 transition-all shadow-xl shadow-indigo-100/50 dark:shadow-none overflow-hidden group">
              <h3 className="text-xl font-serif text-zinc-900 dark:text-white mb-1 relative z-10">
                Auto-Screenshots
              </h3>
              <span className="text-sm text-zinc-500 relative z-10">
                Exact DOM state captured.
              </span>

              {/* Visual Layers */}
              <div className="flex-1 relative mt-4 flex items-center justify-center">
                <div className="absolute w-32 h-24 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg opacity-40 rotate-[-15deg] transition-transform group-hover:rotate-[-20deg]"></div>
                <div className="absolute w-32 h-24 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg opacity-80 rotate-[-5deg] animate-layer"></div>
                <div className="absolute w-32 h-24 bg-indigo-100 dark:bg-indigo-600/20 border border-indigo-300 dark:border-indigo-400 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-sm transition-transform group-hover:scale-105">
                  <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-300 border-2 border-indigo-600 dark:border-indigo-300 px-2 py-1 rounded">
                    .PNG
                  </span>
                </div>
              </div>
            </div>

            {/* Small Card 2: Environment Data */}
            <div className="md:col-span-1 bg-white dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/50 rounded-3xl p-6 flex flex-col hover:border-indigo-200 transition-all shadow-xl shadow-indigo-100/50 dark:shadow-none overflow-hidden">
              <h3 className="text-xl font-serif text-zinc-900 dark:text-white mb-1 relative z-10">
                Environment Data
              </h3>

              {/* Visual JSON Snippet */}
              <div className="mt-4 flex-1 bg-zinc-50 dark:bg-[#18181b] rounded-xl p-4 font-mono text-[11px] leading-relaxed shadow-inner overflow-hidden border border-zinc-200 dark:border-zinc-800 transition-colors duration-500">
                <span className="text-pink-600 dark:text-pink-400">const</span>{" "}
                <span className="text-blue-600 dark:text-blue-300">env</span>{" "}
                <span className="text-zinc-800 dark:text-white">=</span>{" "}
                <span className="text-zinc-800 dark:text-white">{"{"}</span>{" "}
                <br />
                &nbsp;&nbsp;
                <span className="text-cyan-600 dark:text-cyan-300">"os"</span>
                <span className="text-zinc-800 dark:text-white">:</span>{" "}
                <span className="text-amber-600 dark:text-yellow-200">
                  "macOS"
                </span>
                <span className="text-zinc-800 dark:text-white">,</span>
                <br />
                &nbsp;&nbsp;
                <span className="text-cyan-600 dark:text-cyan-300">
                  "browser"
                </span>
                <span className="text-zinc-800 dark:text-white">:</span>{" "}
                <span className="text-amber-600 dark:text-yellow-200">
                  "Chrome"
                </span>
                <span className="text-zinc-800 dark:text-white">,</span>
                <br />
                &nbsp;&nbsp;
                <span className="text-cyan-600 dark:text-cyan-300">
                  "screen"
                </span>
                <span className="text-zinc-800 dark:text-white">:</span>{" "}
                <span className="text-amber-600 dark:text-yellow-200">
                  "1440x900"
                </span>
                <span className="text-zinc-800 dark:text-white">,</span>
                <br />
                &nbsp;&nbsp;
                <span className="text-cyan-600 dark:text-cyan-300">"url"</span>
                <span className="text-zinc-800 dark:text-white">:</span>{" "}
                <span className="text-amber-600 dark:text-yellow-200">
                  "/dashboard"
                </span>
                <br />
                <span className="text-zinc-800 dark:text-white">{"}"};</span>
              </div>
            </div>

            {/* Large Card 2: Real-time Dashboard */}
            <div className="md:col-span-2 bg-white dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/50 rounded-3xl p-6 flex flex-col hover:border-indigo-200 transition-all shadow-xl shadow-indigo-100/50 dark:shadow-none overflow-hidden group">
              <h3 className="text-xl font-serif text-zinc-900 dark:text-white mb-1 relative z-10">
                Real-time Dashboard
              </h3>
              <span className="text-sm text-zinc-500 relative z-10 mb-4">
                Watch tickets drop into your Kanban board instantly.
              </span>

              {/* Dynamic UI adjusting to light/dark */}
              <div className="flex-1 bg-zinc-50 dark:bg-[#1c1c1e] rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 flex gap-4 overflow-hidden transition-colors duration-500">
                {/* TO DO Column */}
                <div className="flex-1 bg-zinc-100/80 dark:bg-[#252528] rounded-lg p-3 flex flex-col gap-3 transition-colors duration-500">
                  <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest pl-1">
                    To Do
                  </div>

                  {/* Ticket 1 */}
                  <div className="bg-white dark:bg-[#2c2c2e] p-3 rounded-md border border-zinc-200 dark:border-zinc-700/50 animate-ticket shadow-sm transition-colors duration-500">
                    <div className="w-8 h-2 bg-[#f87171] rounded-full mb-3"></div>
                    <div className="w-full h-1.5 bg-zinc-200 dark:bg-[#4b4b50] rounded-full mb-2 transition-colors duration-500"></div>
                    <div className="w-2/3 h-1.5 bg-zinc-200 dark:bg-[#4b4b50] rounded-full transition-colors duration-500"></div>
                  </div>

                  {/* Ticket 2 */}
                  <div className="bg-white dark:bg-[#2c2c2e] p-3 rounded-md border border-zinc-200 dark:border-zinc-700/50 shadow-sm transition-colors duration-500">
                    <div className="w-8 h-2 bg-[#facc15] rounded-full mb-3"></div>
                    <div className="w-full h-1.5 bg-zinc-200 dark:bg-[#4b4b50] rounded-full mb-2 transition-colors duration-500"></div>
                    <div className="w-5/6 h-1.5 bg-zinc-200 dark:bg-[#4b4b50] rounded-full transition-colors duration-500"></div>
                  </div>
                </div>

                {/* IN PROGRESS Column */}
                <div className="flex-1 bg-zinc-100/80 dark:bg-[#252528] rounded-lg p-3 flex flex-col gap-3 transition-colors duration-500">
                  <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest pl-1">
                    In Progress
                  </div>

                  <div className="bg-white dark:bg-[#2c2c2e] p-3 rounded-md border border-zinc-200 dark:border-zinc-700/50 shadow-sm transition-colors duration-500">
                    <div className="w-8 h-2 bg-[#60a5fa] rounded-full mb-3"></div>
                    <div className="w-full h-1.5 bg-zinc-200 dark:bg-[#4b4b50] rounded-full mb-2 transition-colors duration-500"></div>
                    <div className="w-3/4 h-1.5 bg-zinc-200 dark:bg-[#4b4b50] rounded-full transition-colors duration-500"></div>
                  </div>
                </div>

                {/* DONE Column */}
                <div className="flex-1 bg-zinc-100/80 dark:bg-[#252528] rounded-lg p-3 flex flex-col gap-3 transition-colors duration-500">
                  <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest pl-1">
                    Done
                  </div>

                  <div className="bg-white dark:bg-[#2c2c2e] p-3 rounded-md border border-zinc-200 dark:border-zinc-700/50 shadow-sm transition-colors duration-500">
                    <div className="w-8 h-2 bg-[#4ade80] rounded-full mb-3"></div>
                    <div className="w-full h-1.5 bg-zinc-200 dark:bg-[#4b4b50] rounded-full mb-2 transition-colors duration-500"></div>
                    <div className="w-full h-1.5 bg-zinc-200 dark:bg-[#4b4b50] rounded-full transition-colors duration-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion Design */}
        <section className="py-24 relative z-10 bg-zinc-100/50 dark:bg-zinc-950/30 border-y border-zinc-200/50 dark:border-zinc-800/50">
          <div className="max-w-3xl mx-auto px-6">
            <div className="mb-12 text-center">
              <h2 className="text-4xl md:text-5xl font-serif text-zinc-900 dark:text-white mb-4 transition-colors duration-500">
                Built defensively.
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 font-mono text-sm uppercase tracking-widest transition-colors duration-500">
                Security & Performance Details
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 rounded-xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center p-6 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <h3
                      className={`font-medium pr-8 transition-colors ${activeFaq === index ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-800 dark:text-zinc-200"}`}
                    >
                      {faq.q}
                    </h3>
                    <span
                      className={`text-xl font-light text-zinc-400 transition-transform duration-300 ${activeFaq === index ? "rotate-45" : ""}`}
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
                    <div className="p-6 pt-0 border-t border-zinc-100 dark:border-zinc-800/50 text-zinc-600 dark:text-zinc-400 leading-relaxed mt-4 mx-6">
                      {faq.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-5xl mx-auto px-6 py-32 relative z-10">
          <div className="bg-gradient-to-b from-white/80 to-indigo-50/50 dark:from-cyan-900/40 dark:to-blue-900/20 border border-zinc-200 dark:border-cyan-500/20 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-200/40 dark:shadow-none transition-colors duration-500">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30 dark:opacity-50"></div>
            <h2 className="text-4xl md:text-6xl font-serif text-zinc-900 dark:text-white mb-6 relative z-10 transition-colors duration-500">
              Ready to fix bugs faster?
            </h2>
            <p className="text-zinc-600 dark:text-cyan-100/60 mb-10 text-lg relative z-10 max-w-xl mx-auto transition-colors duration-500">
              Join thousands of developers who have stopped asking "what browser
              are you using?"
            </p>
            <Link
              to="/register"
              className="inline-block bg-zinc-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-full text-sm font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-lg dark:shadow-[0_0_30px_rgba(255,255,255,0.2)] relative z-10"
            >
              Get started for free
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-zinc-200 dark:border-zinc-800/80 py-12 bg-white/50 dark:bg-zinc-950/50 relative z-10 transition-colors duration-500">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/favicon.svg" alt="Pinpoint Logo" className="w-6 h-6" />
            </div>
            <span className="text-sm font-mono text-zinc-500">
              © 2026 Pinpoint. Built by Kartik Garg.
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
