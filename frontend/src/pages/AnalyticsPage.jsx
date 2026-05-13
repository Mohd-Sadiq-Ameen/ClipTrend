import { useEffect, useState } from 'react';
import { getAnalytics } from '../services/auth';
import { cleanTitle } from '../utils/sanitize';

export default function AnalyticsPage() {
  const [domain, setDomain] = useState('gaming');
  const [source, setSource] = useState('');
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    setLoading(true);
    getAnalytics(domain, 10, source)
      .then(data => {
        console.log(`Fetched ${data.length} trends for domain=${domain}, source=`, data);
        setTrends(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [domain, source]);

  const totalEngagement = trends.reduce((sum, t) => sum + t.engagement, 0);
  const avgEngagement = trends.length ? (totalEngagement / trends.length).toFixed(0) : 0;

  const sourceColors = {
    youtube: { bg: 'from-red-500/10 to-red-500/5', border: 'border-red-200', badge: 'bg-red-100 text-red-700' },
    reddit: { bg: 'from-orange-500/10 to-orange-500/5', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700' },
    google: { bg: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="text-5xl font-bold tracking-tight text-slate-900">Analytics</h1>
            <span className="text-4xl">📊</span>
          </div>
          <p className="text-lg text-slate-600">Track trending content performance across platforms</p>
        </div>

        {/* Filters */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Domain</label>
            <select 
              value={domain} 
              onChange={e => setDomain(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
            >
              <option value="gaming">🎮 Gaming</option>
              <option value="business">💼 Business</option>
              <option value="education">📚 Education</option>
              <option value="general">🌐 General</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Source</label>
            <select 
              value={source} 
              onChange={e => setSource(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
            >
              <option value="">All Sources</option>
              <option value="youtube">📺 YouTube</option>
              <option value="reddit">🤖 Reddit</option>
              <option value="google">🔎 Google Trends</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        {!loading && trends.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 border border-blue-200 rounded-xl p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-600 uppercase tracking-wider mb-2">Total Trends</p>
              <p className="text-4xl font-bold text-blue-600">{trends.length}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-50/50 border border-emerald-200 rounded-xl p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-600 uppercase tracking-wider mb-2">Total Engagement</p>
              <p className="text-4xl font-bold text-emerald-600">{(totalEngagement / 1000).toFixed(1)}K</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-50/50 border border-purple-200 rounded-xl p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-600 uppercase tracking-wider mb-2">Avg Engagement</p>
              <p className="text-4xl font-bold text-purple-600">{(avgEngagement / 1000).toFixed(1)}K</p>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="space-y-3 text-center">
              <div className="inline-flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-3 border-purple-200 border-t-purple-600"></div>
              </div>
              <p className="text-slate-500 font-medium">Loading trends...</p>
            </div>
          </div>
        ) : trends.length === 0 ? (
          <div className="bg-gradient-to-br from-amber-50 to-amber-50/50 border-2 border-dashed border-amber-300 rounded-2xl p-12 text-center">
            <p className="text-lg font-semibold text-amber-900 mb-2">No trends found</p>
            <p className="text-amber-700">Try adjusting your filters or refreshing data from the backend</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">#</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Engagement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trends.map((t, idx) => {
                    const colors = sourceColors[t.source] || sourceColors.google;
                    return (
                      <tr 
                        key={idx}
                        onMouseEnter={() => setHoveredRow(idx)}
                        onMouseLeave={() => setHoveredRow(null)}
                        className={`transition-all duration-200 ${
                          hoveredRow === idx ? `bg-gradient-to-r ${colors.bg} ${colors.border}` : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="px-6 py-4 text-sm font-semibold text-slate-400">{String(idx + 1).padStart(2, '0')}</td>
                        <td className="px-6 py-4">
                          <a 
                            href={t.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="block group"
                          >
                            <p className="text-sm font-semibold text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                              {cleanTitle(t.title).length > 80 ? cleanTitle(t.title).substring(0, 80) + '...' : cleanTitle(t.title)}
                            </p>
                            {t.description && (
                              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{t.description.substring(0, 100)}</p>
                            )}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
                            {t.source === 'youtube' ? '📺' : t.source === 'reddit' ? '🤖' : '🔎'} {t.source}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-sm font-bold text-slate-900">{t.engagement.toLocaleString()}</span>
                          <div className="text-xs text-slate-500 mt-1">engagements</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}