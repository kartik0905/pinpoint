import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const faqs = [
    {
      q: "Why should I add a third-party script to my HTML?",
      a: "Because text-based bug reports waste engineering time. Instead of users saying 'the thing on the left is broken,' Pinpoint gives you exact visual context, browser environment details, and the precise element they clicked. It replaces back-and-forth emails with actionable, visual bug reports.",
    },
    {
      q: "What happens to my website if Pinpoint goes down?",
      a: "Absolutely nothing. The Pinpoint script fails silently. If our servers experience downtime, the feedback widget simply won't appear on your page. Your website will continue to load and function normally without any broken elements or errors visible to your users.",
    },
    {
      q: "Will adding this script slow down my page load times?",
      a: "No. The script is heavily minified, served via a global CDN, and loads asynchronously (async/defer). This means it waits for your core website to finish loading before it initializes, ensuring zero impact on your main thread and Core Web Vitals.",
    },
    {
      q: "Will the widget conflict with my website's CSS or JavaScript?",
      a: "Pinpoint is fully isolated. We use strictly scoped CSS and encapsulated logic so our styling will never bleed into your website, and your styles won't break the widget.",
    },
    {
      q: "Is the widget secure against XSS (Cross-Site Scripting)?",
      a: "Yes. The widget operates inside a secure boundary. We strictly sanitize all inputs and never execute external or user-generated code on your domain, keeping your site safe from injection vulnerabilities.",
    },
    {
      q: "What if a user's screenshot includes a password or credit card field?",
      a: 'Our screenshot engine automatically detects and redacts standard sensitive HTML input fields (like <input type="password">) directly in the browser before the image is ever uploaded to our servers, keeping sensitive data out of your dashboard.',
    },
    {
      q: "Do you collect sensitive user data?",
      a: "We only collect what the user explicitly submits in their feedback, plus non-sensitive metadata (like browser version and screen resolution) to help you debug. We do not scrape unsubmitted form data.",
    },
    {
      q: "Are you GDPR and CCPA compliant?",
      a: "Yes. We do not use third-party tracking cookies, we do not track your users across different websites, and we only process data that is explicitly submitted by the user through the feedback form.",
    },
  ];

  // Softened dark mode to zinc-900, introduced indigo-50/50 for a minor color fill in light mode
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
            <span className="text-xl font-bold text-zinc-900 dark:text-white tracking-tighter transition-colors duration-500">
              Pinpoint
            </span>
          </Link>
          <div className="flex items-center gap-4 md:gap-6">
            {/* Theme Toggle Button */}
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
      <section className="max-w-4xl mx-auto px-6 pt-48 pb-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/60 dark:bg-zinc-800/50 border border-white dark:border-zinc-700/50 backdrop-blur-sm text-cyan-700 dark:text-cyan-400 text-xs font-semibold px-4 py-2 rounded-full mb-8 shadow-sm dark:shadow-xl transition-colors duration-500">
          <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse"></span>
          ONE SCRIPT TAG. INSTANT FEEDBACK.
        </div>

        <h1 className="text-6xl md:text-7xl font-bold text-zinc-900 dark:text-white leading-[1.1] mb-8 tracking-tighter transition-colors duration-500">
          Your users know what's broken. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400">
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
          <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4 tracking-tight transition-colors duration-500">
            Everything you need.{" "}
            <span className="text-zinc-500">Nothing you don't.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          {/* Large Card 1 */}
          <div className="md:col-span-2 bg-white dark:bg-zinc-800/40 dark:bg-gradient-to-br dark:from-zinc-800/60 dark:to-zinc-800/20 border border-white dark:border-zinc-700/50 rounded-3xl p-8 hover:border-indigo-100 dark:hover:border-zinc-600/80 transition-all flex flex-col justify-end relative overflow-hidden group shadow-xl shadow-indigo-100/50 hover:shadow-2xl hover:shadow-indigo-200/50 dark:shadow-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-50/80 dark:bg-cyan-500/10 blur-3xl rounded-full group-hover:bg-cyan-100/80 dark:group-hover:bg-cyan-500/20 transition-all"></div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 relative z-10 transition-colors duration-500">
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
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 relative z-10 transition-colors duration-500">
              Auto-Screenshots
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 relative z-10 transition-colors duration-500">
              Captures the exact DOM state and CSS instantly.
            </p>
          </div>

          {/* Small Card 2 */}
          <div className="md:col-span-1 bg-white dark:bg-zinc-800/40 dark:bg-gradient-to-br dark:from-zinc-800/60 dark:to-zinc-800/20 border border-white dark:border-zinc-700/50 rounded-3xl p-8 hover:border-indigo-100 dark:hover:border-zinc-600/80 transition-all flex flex-col justify-end group relative overflow-hidden shadow-xl shadow-indigo-100/50 hover:shadow-2xl hover:shadow-indigo-200/50 dark:shadow-none">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-50/80 dark:bg-blue-500/10 blur-2xl rounded-full group-hover:bg-blue-100/80 dark:group-hover:bg-blue-500/20 transition-all"></div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 relative z-10 transition-colors duration-500">
              Environment Data
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 relative z-10 transition-colors duration-500">
              Browser, OS, and screen size captured automatically.
            </p>
          </div>

          {/* Large Card 2 */}
          <div className="md:col-span-2 bg-white dark:bg-zinc-800/40 dark:bg-gradient-to-br dark:from-zinc-800/60 dark:to-zinc-800/20 border border-white dark:border-zinc-700/50 rounded-3xl p-8 hover:border-indigo-100 dark:hover:border-zinc-600/80 transition-all flex flex-col justify-end relative overflow-hidden group shadow-xl shadow-indigo-100/50 hover:shadow-2xl hover:shadow-indigo-200/50 dark:shadow-none">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] dark:opacity-[0.03]"></div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 relative z-10 transition-colors duration-500">
              Real-time Dashboard
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 relative z-10 transition-colors duration-500">
              Watch feedback drop into your Kanban board the second a user hits
              submit. No page refreshing required.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4 tracking-tight transition-colors duration-500">
              Built for performance.
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 transition-colors duration-500">
              Answers to your technical and security questions.
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-white dark:border-zinc-700/50 rounded-2xl overflow-hidden bg-white/80 dark:bg-zinc-800/30 backdrop-blur-sm shadow-sm shadow-indigo-100/50 dark:shadow-none transition-colors duration-500 hover:shadow-md hover:border-indigo-100 dark:hover:border-zinc-600/80"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex justify-between items-center p-6 hover:bg-white dark:hover:bg-zinc-800/50 transition-colors duration-200 text-left focus:outline-none"
                >
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-200 pr-4 transition-colors duration-500">
                    {faq.q}
                  </h3>
                  <div
                    className={`w-8 h-8 rounded-full bg-indigo-50/50 dark:bg-zinc-700/30 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-45 bg-indigo-100/80 dark:bg-zinc-600/50" : ""}`}
                  >
                    <svg
                      className="w-4 h-4 text-zinc-500 dark:text-zinc-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="p-6 pt-0">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-indigo-50/80 dark:border-zinc-700/50 pt-4 transition-colors duration-500">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-6 py-32 relative z-10">
        <div className="bg-gradient-to-b from-white/80 to-indigo-50/50 dark:from-cyan-900/30 dark:to-blue-900/20 border border-white dark:border-cyan-500/20 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-200/40 dark:shadow-none transition-colors duration-500">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30 dark:opacity-50"></div>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tight relative z-10 transition-colors duration-500">
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
            <span className="text-xl font-bold text-zinc-900 dark:text-white tracking-tighter transition-colors duration-500">
              Pinpoint
            </span>
          </div>
          <span className="text-sm text-zinc-500 dark:text-zinc-500">
            © 2026 Pinpoint. Built by Kartik Garg.
          </span>
        </div>
      </footer>
    </div>
  );
}
