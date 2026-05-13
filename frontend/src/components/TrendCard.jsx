import { cleanTitle } from '../utils/sanitize';

export default function TrendCard({ trend }) {
  const displayTitle = cleanTitle(trend.title);
  
  return (
    <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${
            trend.source === 'youtube' ? 'bg-red-100 text-red-700' : 
            trend.source === 'reddit' ? 'bg-orange-100 text-orange-700' : 
            'bg-blue-100 text-blue-700'
          }`}>
            {trend.source}
          </span>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">{trend.domain}</span>
        </div>
        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-800 group-hover:text-purple-700 transition">
          {displayTitle}
        </h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-3">{trend.description || 'No description available'}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-purple-600">🔥 {trend.engagement.toLocaleString()}</span>
          {trend.url && (
            <a 
              href={trend.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 text-sm hover:underline flex items-center gap-1"
            >
              View <span>→</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}