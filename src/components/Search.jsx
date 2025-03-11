import { useState, useEffect, useRef } from "react";

export default function Search({ 
  results = [], 
  isLoading = false, 
  onSearch, 
  onSelect 
}) {
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const resultsRef = useRef(null);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearchRef.current(query);
    }, 300);
    
    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [results]);

  useEffect(() => {
    if (highlightedIndex >= 0 && resultsRef.current) {
      const items = resultsRef.current.children;
      const element = items[highlightedIndex];
      element?.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }, [highlightedIndex]);

  const handleKeyDown = (e) => {
    if (results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev => (prev >= results.length - 1 ? 0 : prev + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => (prev <= 0 ? results.length - 1 : prev - 1));
        break;
      case "Enter":
        if (highlightedIndex >= 0 && highlightedIndex < results.length) {
          handleSelect(results[highlightedIndex]);
        }
        break;
    }
  };

  const handleSelect = (result) => {
    onSelect(result);
    setQuery('');
    setHighlightedIndex(-1);
  };

  return (
    <div className="relative" data-testid="search-component">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search city..."
        className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl shadow-sm
                 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                 transition-all duration-200 placeholder-gray-400"
        data-testid="search-input"
      />
      
      {isLoading && (
        <div className="absolute right-4 top-4" data-testid="loading-spinner">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}

      {results.length > 0 && (
        <div 
          ref={resultsRef}
          className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-xl
                    border border-gray-200 divide-y divide-gray-200 max-h-60 overflow-auto"
          data-testid="search-results"
        >
          {results.map((result, index) => (
            <div
              key={result.id}
              className={`px-4 py-3 cursor-pointer transition-colors duration-150
                ${highlightedIndex === index 
                  ? 'bg-blue-500 text-white' 
                  : 'hover:bg-blue-50'}`}
              onClick={() => handleSelect(result)}
              data-testid={`search-result-${result.id}`}
            >
              <div className={`font-medium ${highlightedIndex === index ? 'text-white' : 'text-gray-900'} text-base`}>
                {result.name}
              </div>
              <div className={`text-sm ${highlightedIndex === index ? 'text-blue-100' : 'text-gray-500'} mt-1`}>
                {result.country}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

Search.defaultProps = {
  results: [],
  isLoading: false
};