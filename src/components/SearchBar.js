import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
const baseURL = process.env.FRONTEND_BASE_URL || 'http://localhost:5001/api';

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [phenotypes, setPhenotypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhenotypes = async () => {
      try {
        const response = await fetch(`${baseURL}/getPhenotypeMapping`);
        if (!response.ok) throw new Error('Failed to fetch phenotypes');
        const data = await response.json();
        
        // Transform the mapping object into an array of phenotypes
        const phenotypeArray = Object.entries(data).map(([phecode, info]) => ({
          phenotype_id: phecode,
          category: info.category,
          description: info.description
        }));
        
        setPhenotypes(phenotypeArray);
      } catch (err) {
        console.error('Error fetching phenotypes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPhenotypes();
  }, []);

  const filteredPhenotypes = phenotypes.filter(item =>
    item.phenotype_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (phenotype) => {
    setSearchTerm('');
    setShowSuggestions(false);
    navigate(`/gwas/${phenotype.phenotype_id}`);
  };

  if (loading) {
    return <div className="w-full text-center">Loading...</div>;
  }

  return (
    <div className="relative w-full">
      <Form.Control
        type="text"
        placeholder="Search phenotypes..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
      />
      {showSuggestions && searchTerm && (
        <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {filteredPhenotypes.map((item, idx) => (
            <div
              key={`${item.phenotype_id}-${idx}`}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              <div className="font-medium">{item.phenotype_id}</div>
              <div className="text-sm text-gray-600">{item.category}</div>
              <div className="text-xs text-gray-500">{item.description}</div>
            </div>
          ))}
          {filteredPhenotypes.length === 0 && (
            <div className="px-4 py-2 text-gray-500">No matches found</div>
          )}
        </div>
      )}
    </div>
  );
};