import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 px-6 py-4 flex justify-between items-center max-w-6xl mx-auto">
        <span className="text-lg font-bold text-gray-900">Pinpoint</span>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-block bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full mb-6">
          One script tag. Instant feedback.
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Your users know what's broken.
          <br />
          <span className="text-indigo-600">Now you will too.</span>
        </h1>
        <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
          Pinpoint lets your users highlight exactly what's wrong on your
          website — with a screenshot, a drawing, and a comment. No forms, no
          emails, no guessing.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/register"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            Start for free
          </Link>
          <Link
            to="/login"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Already have an account →
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
            How it works
          </h2>
          <p className="text-gray-500 text-center mb-12 text-sm">
            Set up in 2 minutes. No backend required.
          </p>
          <div className="grid grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Add one script tag",
                desc: "Paste a single line of code into your website's HTML. Works on any framework — React, Vue, plain HTML.",
              },
              {
                step: "02",
                title: "Users highlight issues",
                desc: "A Feedback button appears on your site. Users click it, draw on the screen, and describe the problem.",
              },
              {
                step: "03",
                title: "You fix it faster",
                desc: "See exactly what they saw — screenshot, drawing, browser, device, and page URL. All in your dashboard.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-3xl font-bold text-indigo-100 mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Script tag preview */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            This is all it takes
          </h2>
          <p className="text-gray-500 text-sm">
            One line. Works on any website.
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl px-6 py-5 flex items-center justify-between gap-4">
          <code className="text-green-400 text-sm">
            {`<script src="https://getpinpoint.io/widget.js" data-token="your_token"></script>`}
          </code>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Everything you need
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {[
              {
                title: "Visual annotations",
                desc: "Users draw directly on the page to highlight exactly what's broken.",
              },
              {
                title: "Automatic screenshots",
                desc: "Every report includes a screenshot of exactly what the user saw.",
              },
              {
                title: "Real-time notifications",
                desc: "New feedback appears in your dashboard instantly — no refreshing needed.",
              },
              {
                title: "Device & browser info",
                desc: "Know if it's a mobile Safari bug or a Chrome desktop issue automatically.",
              },
              {
                title: "Google sign-in",
                desc: "One click to get started. No passwords to remember.",
              },
              {
                title: "Multiple projects",
                desc: "Manage feedback across all your websites from one dashboard.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <h3 className="font-semibold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Stop guessing. Start fixing.
        </h2>
        <p className="text-gray-500 mb-8 text-sm">
          Free to use. No credit card required.
        </p>
        <Link
          to="/register"
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          Get started for free
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-900">Pinpoint</span>
          <span className="text-xs text-gray-400">Built by Kartik Garg</span>
        </div>
      </footer>
    </div>
  );
}
