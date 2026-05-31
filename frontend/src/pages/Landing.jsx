import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  const [activeFaq, setActiveFaq] = useState(0);

  // Initialize theme from localStorage, default to dark
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

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
    <div className="min-h-screen bg-indigo-50/50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 selection:bg-cyan-500/30 relative overflow-hidden font-sans transition-colors duration-500">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-cyan-400/20 to-purple-400/20 dark:from-cyan-500/20 dark:to-purple-600/20 blur-[120px] rounded-full pointer-events-none -z-10 transition-colors duration-500"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-t from-blue-400/10 to-cyan-400/10 dark:from-blue-600/10 dark:to-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10 transition-colors duration-500"></div>

      {/* Floating Glass Navbar */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-5xl z-50">
        <nav className="bg-white/80 dark:bg-zinc-800/60 backdrop-blur-xl border border-white dark:border-zinc-700/50 rounded-full px-6 py-3 flex justify-between items-center shadow-lg shadow-zinc-200/50 dark:shadow-2xl transition-all duration-500">
          <Link to="/" className="flex items-center gap-2 group">
            <svg
              className="w-6 h-6 text-cyan-600 dark:text-cyan-400 transition-transform group-hover:rotate-90 duration-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v4M12 18v4M4 12H2M22 12h-2" />
              <circle cx="12" cy="12" r="10" className="opacity-30" />
            </svg>
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
      <section className="max-w-5xl mx-auto px-6 pt-48 pb-20 text-center relative z-10">
        <div className="inline-flex items-center gap-3 bg-white/60 dark:bg-zinc-800/50 border border-white dark:border-zinc-700/50 backdrop-blur-sm text-cyan-700 dark:text-cyan-400 text-xs font-mono px-5 py-2 rounded-full mb-8 shadow-sm dark:shadow-xl uppercase tracking-wider transition-colors duration-500">
          <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse"></span>
          One script tag. Instant feedback.
        </div>

        <h1 className="text-6xl md:text-8xl font-serif text-zinc-900 dark:text-white leading-[1.05] mb-8 transition-colors duration-500">
          Your users know what's broken. <br />
          <span className="text-transparent font-sans font-bold bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 tracking-tighter">
            Now you will too.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed transition-colors duration-500">
          Pinpoint lets your users highlight exactly what's wrong on your
          website — with a screenshot, a drawing, and a comment. No forms, no
          emails, no guessing.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-500 dark:to-blue-600 text-white px-8 py-4 rounded-full text-base font-semibold hover:from-cyan-500 hover:to-blue-500 dark:hover:from-cyan-400 dark:hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/30 dark:shadow-[0_0_30px_rgba(8,145,178,0.3)] hover:shadow-cyan-500/40 dark:hover:shadow-[0_0_40px_rgba(8,145,178,0.5)] transform hover:-translate-y-0.5"
          >
            Start building for free
          </Link>
        </div>
      </section>

      {/* Script tag preview */}
      <section className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border border-white dark:border-zinc-700/50 rounded-2xl p-1 shadow-2xl shadow-indigo-200/50 dark:shadow-2xl transition-colors duration-500">
          <div className="bg-white dark:bg-zinc-950 rounded-xl overflow-hidden transition-colors duration-500">
            <div className="flex items-center px-4 py-3 border-b border-indigo-50 dark:border-zinc-800 bg-indigo-50/30 dark:bg-zinc-900 transition-colors duration-500">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500/20 border border-red-500/20 dark:border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400 dark:bg-yellow-500/20 border border-yellow-500/20 dark:border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500/20 border border-green-500/20 dark:border-green-500/50"></div>
              </div>
              <span className="ml-4 text-xs font-mono text-zinc-400 dark:text-zinc-500">
                index.html
              </span>
            </div>
            <div className="p-6 overflow-x-auto bg-zinc-900 dark:bg-transparent">
              <code className="text-sm font-mono leading-loose whitespace-nowrap">
                <span className="text-zinc-500">
                  &lt;!-- Drop this before the closing body tag --&gt;
                </span>
                <br />
                <span className="text-pink-400">&lt;script</span>{" "}
                <span className="text-cyan-300">src</span>=
                <span className="text-yellow-200">
                  "https://getpinpoint.io/widget.js"
                </span>{" "}
                <span className="text-cyan-300">data-token</span>=
                <span className="text-yellow-200">"your_api_token"</span>
                <span className="text-pink-400">&gt;&lt;/script&gt;</span>
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Box Features */}
      <section className="max-w-6xl mx-auto px-6 py-24 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-zinc-900 dark:text-white mb-4 transition-colors duration-500">
            Everything you need.{" "}
            <span className="text-zinc-500 dark:text-zinc-600 italic">
              Nothing you don't.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          {/* Large Card 1 */}
          <div className="md:col-span-2 bg-white dark:bg-zinc-800/40 dark:bg-gradient-to-br dark:from-zinc-800/60 dark:to-zinc-800/20 border border-white dark:border-zinc-700/50 rounded-3xl p-8 hover:border-indigo-100 dark:hover:border-zinc-600/80 transition-all flex flex-col justify-end relative overflow-hidden group shadow-xl shadow-indigo-100/50 hover:shadow-2xl hover:shadow-indigo-200/50 dark:shadow-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-50/80 dark:bg-cyan-500/10 blur-3xl rounded-full group-hover:bg-cyan-100/80 dark:group-hover:bg-cyan-500/20 transition-all"></div>
            <h3 className="text-2xl font-serif text-zinc-900 dark:text-white mb-2 relative z-10 transition-colors duration-500">
              Visual annotations
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 relative z-10 transition-colors duration-500">
              Users draw directly on the page to highlight exactly what's
              broken, giving you undeniable proof of the issue.
            </p>
          </div>

          {/* Small Card 1 */}
          <div className="md:col-span-1 bg-white dark:bg-zinc-800/40 dark:bg-gradient-to-br dark:from-zinc-800/60 dark:to-zinc-800/20 border border-white dark:border-zinc-700/50 rounded-3xl p-8 hover:border-indigo-100 dark:hover:border-zinc-600/80 transition-all flex flex-col justify-end group relative overflow-hidden shadow-xl shadow-indigo-100/50 hover:shadow-2xl hover:shadow-indigo-200/50 dark:shadow-none">
            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-50/80 dark:bg-purple-500/10 blur-2xl rounded-full group-hover:bg-purple-100/80 dark:group-hover:bg-purple-500/20 transition-all"></div>
            <h3 className="text-xl font-serif text-zinc-900 dark:text-white mb-2 relative z-10 transition-colors duration-500">
              Auto-Screenshots
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 relative z-10 transition-colors duration-500">
              Captures the exact DOM state and CSS instantly.
            </p>
          </div>

          {/* Small Card 2 */}
          <div className="md:col-span-1 bg-white dark:bg-zinc-800/40 dark:bg-gradient-to-br dark:from-zinc-800/60 dark:to-zinc-800/20 border border-white dark:border-zinc-700/50 rounded-3xl p-8 hover:border-indigo-100 dark:hover:border-zinc-600/80 transition-all flex flex-col justify-end group relative overflow-hidden shadow-xl shadow-indigo-100/50 hover:shadow-2xl hover:shadow-indigo-200/50 dark:shadow-none">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-50/80 dark:bg-blue-500/10 blur-2xl rounded-full group-hover:bg-blue-100/80 dark:group-hover:bg-blue-500/20 transition-all"></div>
            <h3 className="text-xl font-serif text-zinc-900 dark:text-white mb-2 relative z-10 transition-colors duration-500">
              Environment Data
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 relative z-10 transition-colors duration-500">
              Browser, OS, and screen size captured automatically.
            </p>
          </div>

          {/* Large Card 2 */}
          <div className="md:col-span-2 bg-white dark:bg-zinc-800/40 dark:bg-gradient-to-br dark:from-zinc-800/60 dark:to-zinc-800/20 border border-white dark:border-zinc-700/50 rounded-3xl p-8 hover:border-indigo-100 dark:hover:border-zinc-600/80 transition-all flex flex-col justify-end relative overflow-hidden group shadow-xl shadow-indigo-100/50 hover:shadow-2xl hover:shadow-indigo-200/50 dark:shadow-none">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] dark:opacity-[0.03]"></div>
            <h3 className="text-2xl font-serif text-zinc-900 dark:text-white mb-2 relative z-10 transition-colors duration-500">
              Real-time Dashboard
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 relative z-10 transition-colors duration-500">
              Watch feedback drop into your Kanban board the second a user hits
              submit. No page refreshing required.
            </p>
          </div>
        </div>
      </section>

      {/* Split-Pane FAQs Design */}
      <section className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-serif text-zinc-900 dark:text-white mb-4 transition-colors duration-500">
              Built defensively.
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-mono text-sm uppercase tracking-widest transition-colors duration-500">
              Security & Performance Details
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Navigation List */}
            <div className="lg:col-span-5 space-y-2">
              {faqs.map((faq, i) => (
                <button
                  key={i}
                  onClick={() => setActiveFaq(i)}
                  className={`w-full text-left px-6 py-5 rounded-2xl transition-all duration-300 border ${
                    activeFaq === i
                      ? "bg-white dark:bg-white/[0.08] border-indigo-100 dark:border-white/20 shadow-md shadow-indigo-100/50 dark:shadow-lg"
                      : "bg-transparent border-transparent hover:bg-white/50 dark:hover:bg-white/[0.02]"
                  }`}
                >
                  <h3
                    className={`font-medium transition-colors duration-300 ${activeFaq === i ? "text-cyan-700 dark:text-cyan-300" : "text-zinc-600 dark:text-zinc-400"}`}
                  >
                    {faq.q}
                  </h3>
                </button>
              ))}
            </div>

            {/* Right Column: Display Card */}
            <div className="lg:col-span-7 hidden lg:block">
              <div className="h-full bg-white/80 dark:bg-white/[0.02] backdrop-blur-xl border border-white dark:border-white/10 rounded-3xl p-12 flex flex-col justify-center transition-colors duration-500 shadow-xl shadow-indigo-100/30 dark:shadow-none">
                <div className="inline-flex items-center gap-2 mb-6 text-cyan-600 dark:text-cyan-400 font-mono text-xs uppercase tracking-widest">
                  <span className="w-8 h-px bg-cyan-600/50 dark:bg-cyan-400/50"></span>
                  Answer
                </div>
                <p
                  key={activeFaq}
                  className="text-2xl lg:text-3xl font-serif text-zinc-800 dark:text-white leading-relaxed animate-[fadeIn_0.5s_ease-out]"
                >
                  {faqs[activeFaq].a}
                </p>
              </div>
            </div>

            {/* Mobile Fallback Answer */}
            <div className="lg:hidden lg:col-span-7">
              <div className="bg-white dark:bg-white/[0.04] border border-indigo-50 dark:border-white/10 rounded-2xl p-6 mt-4 shadow-md dark:shadow-none transition-colors duration-500">
                <p className="text-lg font-serif text-zinc-800 dark:text-white leading-relaxed">
                  {faqs[activeFaq].a}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-6 py-32 relative z-10">
        <div className="bg-gradient-to-b from-white/80 to-indigo-50/50 dark:from-cyan-900/40 dark:to-blue-900/20 border border-white dark:border-cyan-500/20 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-200/40 dark:shadow-none transition-colors duration-500">
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
      <footer className="border-t border-indigo-100/50 dark:border-zinc-800/80 py-12 bg-indigo-50/30 dark:bg-zinc-950/50 relative z-10 transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-cyan-600 dark:text-cyan-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v4M12 18v4M4 12H2M22 12h-2" />
            </svg>
            <span className="text-xl font-bold font-serif text-zinc-900 dark:text-white tracking-tighter transition-colors duration-500">
              Pinpoint
            </span>
          </div>
          <span className="text-sm font-mono text-zinc-500">
            © 2026 Pinpoint. Built by Kartik Garg.
          </span>
        </div>
      </footer>
    </div>
  );
}
