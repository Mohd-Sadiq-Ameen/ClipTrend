import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const technologies = [
    { name: "React 18", icon: "⚛️", desc: "Frontend library for reactive UI" },
    { name: "Flask", icon: "🐍", desc: "Lightweight Python backend" },
    { name: "Tailwind CSS", icon: "🎨", desc: "Utility‑first styling" },
    { name: "SQLite", icon: "🗄️", desc: "Embedded database" },
    { name: "YouTube API", icon: "📺", desc: "Fetch viral video stats" },
    { name: "Reddit API", icon: "🤖", desc: "Read hot discussions" },
    { name: "Google Trends", icon: "🔎", desc: "Search interest analysis" },
    { name: "JWT Auth", icon: "🔐", desc: "Secure authentication" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col">
      <div className="container mx-auto px-6 py-12 flex-1">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            ClipTrend
          </motion.h1>
          <div className="space-x-4">
            <Link to="/login" className="px-5 py-2 rounded-full border border-white/30 hover:bg-white/10 transition">Login</Link>
            <Link to="/signup" className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold shadow-lg hover:shadow-xl transition">Sign Up</Link>
          </div>
        </nav>
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
          >
            Discover Viral Content Ideas
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-gray-200"
          >
            AI‑powered trend intelligence from YouTube, Reddit & Google Trends
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/signup" className="inline-block bg-white text-purple-700 px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-xl transition transform hover:-translate-y-1">
              Start Free Trial
            </Link>
          </motion.div>
        </div>
        
        {/* Features Grid (unchanged) */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          {[
            { icon: "📺", title: "YouTube Trends", text: "Analyze viral video hooks, titles, and view counts" },
            { icon: "🤖", title: "Reddit Insights", text: "Discover pain points and viral discussions" },
            { icon: "🔎", title: "Google Trends", text: "Track rising search queries in real-time" }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-200">{feature.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Technologies Used Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-28"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            🛠️ Built with Modern Tech Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {technologies.map((tech, idx) => (
              <div 
                key={idx}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10 hover:bg-white/10 transition"
              >
                <div className="text-3xl mb-2">{tech.icon}</div>
                <div className="font-semibold text-lg">{tech.name}</div>
                <div className="text-xs text-gray-300 mt-1">{tech.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 mt-12">
        <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
          <p>
            🎓 <span className="font-semibold text-white">ClipTrend</span> – A College Project for Trend Intelligence
          </p>
          <p className="mt-1">
            Developed by Jamia Hamdard University Student • New Delhi, India
          </p>
          <p className="mt-1 text-xs text-gray-500">
            © 2026 • All data sourced from public APIs (YouTube, Reddit, Google Trends) • For educational purposes only
          </p>
        </div>
      </footer>
    </div>
  );
}