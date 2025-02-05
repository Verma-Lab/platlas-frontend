import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import _ from 'lodash';

const baseURL = process.env.FRONTEND_BASE_URL || 'http://localhost:5001/api';
const RESULTS_PER_PAGE = 50;

export const SearchBar = () => {
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [metadata, setMetadata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [displayCount, setDisplayCount] = useState(RESULTS_PER_PAGE);
  const navigate = useNavigate();

  // Debounced search term updater
  const debouncedSetSearchTerm = useMemo(
    () => _.debounce((value) => setSearchTerm(value), 300),
    []
  );

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(`${baseURL}/getGWASMetadata`);
        if (!response.ok) throw new Error('Failed to fetch metadata');
        const data = await response.json();
        
        // Process and deduplicate the data
        const searchableData = _.uniqBy(
          data.map(item => ({
            phenotype: item.phenotype,
            traitDescription: item.traitDescription,
            category: item.category,
            population: item.population
          })),
          item => `${item.phenotype}-${item.population}`
        );

        setMetadata(searchableData);
      } catch (err) {
        console.error('Error fetching metadata:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetadata();
  }, []);

  // Memoized filtered results
  const filteredResults = useMemo(() => {
    if (!searchTerm) return [];
    
    const termLower = searchTerm.toLowerCase();
    return metadata
      .filter(item =>
        item.phenotype.toLowerCase().includes(termLower) ||
        item.traitDescription.toLowerCase().includes(termLower) ||
        item.category.toLowerCase().includes(termLower)
      )
      .slice(0, displayCount);
  }, [metadata, searchTerm, displayCount]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSetSearchTerm(value);
    setShowSuggestions(true);
  };

  const handleSelect = useCallback((item) => {
    setInputValue('');
    setSearchTerm('');
    setShowSuggestions(false);
    navigate(`/gwas/${item.phenotype}`, { state: { population: item.population } });
  }, [navigate]);

  const handleScroll = useCallback((e) => {
    const element = e.target;
    if (
      element.scrollHeight - element.scrollTop <= element.clientHeight + 50 &&
      filteredResults.length >= displayCount
    ) {
      setDisplayCount(prev => prev + RESULTS_PER_PAGE);
    }
  }, [filteredResults.length, displayCount]);

  if (loading) {
    return <div className="w-full text-center">Loading...</div>;
  }

  return (
    <div className="relative w-full mb-8">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search phenotypes..."
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg 
                    bg-white shadow-sm focus:outline-none focus:ring-2 
                    focus:ring-blue-500 focus:border-blue-500
                    text-sm placeholder-gray-400"
        />
      </div>
      
      {showSuggestions && searchTerm && (
        <div 
          className="absolute w-full bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto"
          style={{
            zIndex: 9999,
            top: 'calc(100% + 4px)',
          }}
          onScroll={handleScroll}
        >
          {filteredResults.map((item, idx) => (
            <div
              key={`${item.phenotype}-${item.population}-${idx}`}
              className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer flex justify-between"
              onClick={() => handleSelect(item)}
            >
              <div>
                <div className="font-medium text-gray-900">{item.phenotype}</div>
                <div className="text-xs text-gray-600">{item.category}</div>
              </div>
              <div className="text-right">
                <div className="text-xs px-2 py-0.5 rounded-full text-gray-600">
                  {item.population}
                </div>
                <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">
                  {item.traitDescription}
                </div>
              </div>
            </div>
          ))}
          {filteredResults.length === 0 && (
            <div className="px-3 py-1.5 text-gray-500 text-sm">No matches found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;