import { useEffect, useState } from 'react';
import { getAnalytics } from '../services/auth';
import TrendCard from '../components/TrendCard';

export default function Dashboard() {
  const [domain, setDomain] = useState('gaming');
  const [youtubeTrends, setYoutubeTrends] = useState([]);
  const [redditTrends, setRedditTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getAnalytics(domain, 6, 'youtube'),
      getAnalytics(domain, 6, 'reddit')
    ]).then(([youtube, reddit]) => {
      setYoutubeTrends(youtube);
      setRedditTrends(reddit);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [domain]);

  const domains = [
    { value: 'gaming', label: '🎮', name: 'Gaming', color: 'from-violet-500 to-violet-600' },
    { value: 'business', label: '💼', name: 'Business', color: 'from-blue-500 to-blue-600' },
    { value: 'education', label: '📚', name: 'Education', color: 'from-emerald-500 to-emerald-600' },
    { value: 'general', label: '🌐', name: 'General', color: 'from-cyan-500 to-cyan-600' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex justify-center items-center">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center justify-center">
            <div className="animate-spin rounded-full h-14 w-14 border-3 border-slate-200 border-t-purple-600"></div>
          </div>
          <p className="text-slate-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-baseline gap-3 mb-4">
            <h1 className="text-5xl font-bold tracking-tight text-slate-900">Dashboard</h1>
            <span className="text-4xl">📊</span>
          </div>
          <p className="text-lg text-slate-600">Real‑time trends from YouTube & Reddit</p>
        </div>

        {/* Domain Selector */}
        <div className="mb-12 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">Select Category</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {domains.map(d => (
              <button
                key={d.value}
                onClick={() => setDomain(d.value)}
                className={`group relative overflow-hidden rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  domain === d.value 
                    ? `bg-gradient-to-r ${d.color} text-white shadow-lg` 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <div className="px-4 py-4 text-center">
                  <div className="text-3xl mb-2">{d.label}</div>
                  <p className={`text-sm font-semibold ${domain === d.value ? 'text-white' : 'text-slate-600'}`}>
                    {d.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* YouTube Section */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-lg p-3">
              <span className="text-2xl">📺</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">YouTube Viral Videos</h2>
              <p className="text-sm text-slate-500 mt-1">Top trending videos in {domains.find(d => d.value === domain)?.name}</p>
            </div>
          </div>
          {youtubeTrends.length === 0 ? (
            <div className="bg-gradient-to-br from-red-50 to-red-50/50 border-2 border-dashed border-red-300 rounded-xl p-12 text-center">
              <p className="text-lg font-semibold text-red-900 mb-2">No YouTube trends yet</p>
              <p className="text-red-700">Try a different category or check back later</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {youtubeTrends.map((trend, idx) => (
                <TrendCard key={idx} trend={trend} />
              ))}
            </div>
          )}
        </div>

        {/* Reddit Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg p-3">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Reddit Hot Discussions</h2>
              <p className="text-sm text-slate-500 mt-1">Most discussed topics in {domains.find(d => d.value === domain)?.name}</p>
            </div>
          </div>
          {redditTrends.length === 0 ? (
            <div className="bg-gradient-to-br from-orange-50 to-orange-50/50 border-2 border-dashed border-orange-300 rounded-xl p-12 text-center">
              <p className="text-lg font-semibold text-orange-900 mb-2">No Reddit discussions yet</p>
              <p className="text-orange-700">Try a different category or check back later</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {redditTrends.map((trend, idx) => (
                <TrendCard key={idx} trend={trend} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}