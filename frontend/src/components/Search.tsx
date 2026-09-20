import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, TrendingUp } from 'lucide-react';

interface SearchResult {
  symbol: string;
  shortname: string;
  quoteType: string;
  exchange: string;
}

interface SearchProps {
  onSelect: (symbol: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3001/api/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setResults(data.slice(0, 8)); // limit to 8 results
        setIsOpen(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 500);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSelect = (symbol: string) => {
    setQuery('');
    setIsOpen(false);
    onSelect(symbol);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl mx-auto z-50">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow shadow-sm"
          placeholder="Search for symbols (e.g. BTC-USD, AAPL, YPF.BA)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute mt-1 w-full bg-white shadow-lg max-h-96 rounded-xl py-1 text-base overflow-auto focus:outline-none sm:text-sm border border-gray-100">
          {results.map((result, idx) => (
            <div
              key={idx}
              className="cursor-pointer select-none relative py-3 pl-4 pr-9 hover:bg-gray-50 transition-colors flex items-center justify-between border-b border-gray-50 last:border-0"
              onClick={() => handleSelect(result.symbol)}
            >
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-lg mr-3">
                  <TrendingUp className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <span className="block font-bold text-gray-900">{result.symbol}</span>
                  <span className="block text-gray-500 text-xs mt-0.5 truncate max-w-[200px]">{result.shortname}</span>
                </div>
              </div>
              <div className="text-right">
                 <span className="inline-block bg-blue-50 text-blue-700 text-[10px] px-2 py-1 rounded-full font-semibold uppercase tracking-wider">{result.quoteType}</span>
                 <span className="block text-gray-400 text-[10px] mt-1">{result.exchange}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
