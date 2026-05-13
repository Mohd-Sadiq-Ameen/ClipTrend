import { useState, useEffect } from 'react';
import { getAnalytics, askQuestion } from '../services/auth';
import { cleanTitle } from '../utils/sanitize';

export default function SearchPage() {
  const [domain, setDomain] = useState('gaming');
  const [source, setSource] = useState('');
  const [query, setQuery] = useState('');
  const [topIdea, setTopIdea] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trendsBySource, setTrendsBySource] = useState({});
  const [loadingSources, setLoadingSources] = useState({});

  useEffect(() => {
    const loadAllSources = async () => {
      const sources = ['youtube', 'reddit', 'google'];
      setLoadingSources({ youtube: true, reddit: true, google: true });
      
      for (const src of sources) {
        try {
          const data = await getAnalytics(domain, 5, src);
          setTrendsBySource(prev => ({ ...prev, [src]: data }));
        } catch (err) {
          console.error(`Failed to load ${src}:`, err);
        } finally {
          setLoadingSources(prev => ({ ...prev, [src]: false }));
        }
      }
    };
    
    loadAllSources();
  }, [domain]);

  const handleGetTopIdea = async () => {
    setLoading(true);
    try {
      const idea = await askQuestion(domain, query, source);
      setTopIdea(idea);
    } catch (err) {
      setTopIdea({
        title: "No data available",
        description: `We couldn't find any viral idea for ${domain}. Try selecting a different domain or refreshing data.`,
        expected_reach: "0",
        why_viral: "No engagement data yet",
        source_hint: null,
        url: null
      });
    }
    setLoading(false);
  };

  const sources = [
    { key: 'youtube', name: 'YouTube', icon: '📺', color: 'from-red-500 to-red-600' },
    { key: 'reddit', name: 'Reddit', icon: '🤖', color: 'from-orange-500 to-orange-600' },
    { key: 'google', name: 'Google Trends', icon: '🔎', color: 'from-blue-500 to-blue-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="text-5xl font-bold tracking-tight text-slate-900">Search Viral Ideas</h1>
            <span className="text-4xl">🔍</span>
          </div>
          <p className="text-lg text-slate-600">Discover what's trending across platforms</p>
        </div>

        {/* Search Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Domain</label>
              <select 
                value={domain} 
                onChange={e => setDomain(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="gaming">🎮 Gaming</option>
                <option value="business">💼 Business</option>
                <option value="education">📚 Education</option>
                <option value="general">🌐 General</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">Choose your industry</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Platform (optional)</label>
              <select 
                value={source} 
                onChange={e => setSource(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Platforms</option>
                <option value="youtube">📺 YouTube</option>
                <option value="reddit">🤖 Reddit</option>
                <option value="google">🔎 Google Trends</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Keyword (optional)</label>
              <input 
                type="text" 
                value={query} 
                onChange={e => setQuery(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleGetTopIdea()}
                placeholder="e.g., funny moments..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          <button 
            onClick={handleGetTopIdea}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                Analyzing trends...
              </span>
            ) : (
              '✨ Get Top Viral Idea'
            )}
          </button>
        </div>

        {/* Top Viral Idea */}
        {topIdea && (
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 border-2 border-purple-200 rounded-2xl p-8 mb-12 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <span className="text-5xl">🔥</span>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-purple-900 mb-2">Top Viral Idea</h2>
                <p className="text-xl font-semibold text-purple-800 leading-relaxed">{cleanTitle(topIdea.title)}</p>
              </div>
              {topIdea.source_hint && (
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                  topIdea.source_hint === 'youtube' ? 'bg-red-100 text-red-700' :
                  topIdea.source_hint === 'reddit' ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {topIdea.source_hint === 'youtube' && '📺'}
                  {topIdea.source_hint === 'reddit' && '🤖'}
                  {topIdea.source_hint === 'google' && '🔎'}
                  {topIdea.source_hint}
                </span>
              )}
            </div>
            
            <p className="text-slate-700 text-lg mb-6 leading-relaxed">{topIdea.description}</p>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-3 bg-white/70 backdrop-blur px-4 py-3 rounded-lg border border-white/50">
                <span className="text-2xl">📈</span>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Expected Reach</p>
                  <p className="text-lg font-bold text-slate-900">{topIdea.expected_reach}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/70 backdrop-blur px-4 py-3 rounded-lg border border-white/50">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Why Viral</p>
                  <p className="text-lg font-bold text-slate-900">{topIdea.why_viral}</p>
                </div>
              </div>
            </div>
            
            {topIdea.url && (
              <a 
                href={topIdea.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-purple-700 font-semibold px-6 py-3 rounded-lg border border-purple-200 transition-all duration-200 hover:shadow-md"
              >
                View Original Content <span className="text-xl">→</span>
              </a>
            )}
          </div>
        )}

        {/* Trends by Platform */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Trending by Platform</h2>
          <p className="text-slate-600 mb-8">Top 5 from each source</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sources.map(src => (
              <div key={src.key} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <div className={`bg-gradient-to-r ${src.color} px-6 py-4`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{src.icon}</span>
                    <h3 className="text-lg font-bold text-white">{src.name}</h3>
                  </div>
                </div>
                
                <div className="p-6">
                  {loadingSources[src.key] ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-purple-600"></div>
                      </div>
                      <p className="text-slate-500 text-sm mt-3">Loading...</p>
                    </div>
                  ) : trendsBySource[src.key] && trendsBySource[src.key].length > 0 ? (
                    <ul className="space-y-4">
                      {trendsBySource[src.key].map((t, idx) => (
                        <li key={idx} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                          <a 
                            href={t.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="group block"
                          >
                            <p className="text-sm font-semibold text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                              {cleanTitle(t.title).length > 60 ? cleanTitle(t.title).substring(0, 60) + '…' : cleanTitle(t.title)}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">
                                🔥 {(t.engagement / 1000).toFixed(1)}K
                              </span>
                              <span className="text-xs text-slate-500 font-medium">{t.domain}</span>
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-400 text-sm">No data available</p>
                      <p className="text-slate-300 text-xs mt-1">Try a different domain</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}