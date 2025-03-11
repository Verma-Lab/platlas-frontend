import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  MapPin, 
  ArrowUpRight, 
  FileText, 
  Activity, 
  ChevronDown,
  Globe,
  BarChart,
  Menu,
  X,
  Filter,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import _ from 'lodash';

const baseURL = process.env.FRONTEND_BASE_URL || 'http://localhost:5001/api';

/**
 * Function to get styles based on cohort name.
 */
const getCohortStyle = (cohort) => {
  const styles = {
    Meta: {
      tag: 'bg-gradient-to-r from-violet-500 to-purple-500 text-white',
      bar: 'bg-gradient-to-r from-violet-500 to-purple-500',
      text: 'text-violet-700'
    },
    EUR: {
      tag: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
      bar: 'bg-gradient-to-r from-blue-500 to-blue-600',
      text: 'text-blue-700'
    },
    EAS: {
      tag: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white',
      bar: 'bg-gradient-to-r from-emerald-500 to-green-600',
      text: 'text-emerald-700'
    },
    AFR: {
      tag: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
      bar: 'bg-gradient-to-r from-amber-500 to-orange-600',
      text: 'text-amber-700'
    },
    AMR: {
      tag: 'bg-gradient-to-r from-rose-500 to-red-600 text-white',
      bar: 'bg-gradient-to-r from-rose-500 to-red-600',
      text: 'text-rose-700'
    },
    default: {
      tag: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
      bar: 'bg-gradient-to-r from-gray-500 to-gray-600',
      text: 'text-gray-700'
    }
  };
  return styles[cohort] || styles.default;
};

/**
 * Component for mobile card view of a table row
 */
const MobileVariantCard = ({ item, onCohortClick, onLeadSNPClick }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4"
      whileHover={{ scale: 1.01 }}
    >
      {/* Card Header - Always visible */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-gray-900">{item.trait.name}</h3>
          <p className="text-xs text-gray-500 mt-1">{item.trait.description}</p>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100">
          {item.category}
        </span>
      </div>
      
      {/* Quick Stats - Always visible */}
      <div className="grid grid-cols-3 gap-2 mb-3 py-2 border-t border-b border-gray-100">
        <div className="text-center">
          <div className="flex items-center justify-center text-sm font-semibold text-gray-900">
            {item.cohorts.length}
          </div>
          <div className="text-xs text-gray-500">Populations</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center text-sm font-semibold text-gray-900">
            {item.variants.length}
          </div>
          <div className="text-xs text-gray-500">Lead SNPs</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center text-sm font-semibold text-gray-900">
            {Object.values(item.studies_by_pop).reduce((a, b) => a + b, 0)}
          </div>
          <div className="text-xs text-gray-500">Studies</div>
        </div>
      </div>
      
      {/* Expand/Collapse Button */}
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
      >
        <span>{expanded ? "Show Less" : "Show More"}</span>
        <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Expanded Content */}
      {expanded && (
        <div className="mt-4 space-y-4">
          {/* Populations */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Populations</h4>
            <div className="flex flex-wrap gap-2">
              {item.cohorts.map((cohort, idx) => (
                <button
                  key={idx}
                  onClick={() => onCohortClick(item.trait.name, cohort)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium ${getCohortStyle(cohort).tag}`}
                >
                  {cohort}
                </button>
              ))}
            </div>
          </div>
          
          {/* Sample Sizes */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Sample Sizes</h4>
            <div className="space-y-2">
              {item.cohorts.map((cohort, idx) => {
                const variant = item.variants.find(v => v.cohort === cohort);
                const size = variant ? variant.n_total : 0;
                const maxSize = Math.max(...item.variants.map(v => v.n_total));
                
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-medium ${getCohortStyle(cohort).text}`}>{cohort}:</span>
                      <span className="text-gray-600">{new Intl.NumberFormat('en-US').format(size)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${getCohortStyle(cohort).bar}`}
                        style={{ width: `${(size / maxSize) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Lead SNPs */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Lead SNPs</h4>
            {item.variants.map((variant, idx) => (
              <div 
                key={idx}
                onClick={() => onLeadSNPClick(variant)}
                className="p-3 mb-2 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <div className="flex justify-between">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getCohortStyle(variant.cohort).tag}`}>
                    {variant.cohort}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">{variant.lead_snp.rsid}</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <MapPin className="w-3 h-3" />
                    <span>Chr{variant.lead_snp.position.chromosome}:{variant.lead_snp.position.position.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Activity className="w-3 h-3" />
                    <span>Log10P: {variant.lead_snp.log10p.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Studies */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Studies</h4>
            <div className="space-y-2">
              {Object.entries(item.studies_by_pop).map(([pop, studyCount]) => (
                <div key={pop} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-gray-400 mr-2" />
                    <span className={`text-sm ${getCohortStyle(pop).text}`}>
                      {pop}:
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {studyCount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

/**
 * Filter drawer for mobile
 */
const MobileFilterDrawer = ({ isOpen, onClose, filters, setFilters, filterOptions }) => {
  return (
    <div className={`fixed inset-0 z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 transform transition-transform ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Filters</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pb-6">
          {/* Category Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
            <div className="space-y-2">
              {filterOptions.category.map((option) => (
                <label 
                  key={option} 
                  className="flex items-center p-2 hover:bg-gray-50 rounded-md"
                >
                  <input
                    type="checkbox"
                    checked={filters.category.includes(option)}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...filters.category, option]
                        : filters.category.filter(val => val !== option);
                      setFilters({...filters, category: newValues});
                    }}
                    className="mr-2 rounded-sm text-blue-600"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Population Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Populations</h4>
            <div className="flex flex-wrap gap-2">
              {filterOptions.populations.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    const newValues = filters.populations.includes(option)
                      ? filters.populations.filter(val => val !== option)
                      : [...filters.populations, option];
                    setFilters({...filters, populations: newValues});
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    filters.populations.includes(option)
                      ? getCohortStyle(option).tag
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          {/* Lead SNPs Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Lead SNPs Count</h4>
            <div className="space-y-2">
              {filterOptions.leadsnps.map((option) => (
                <label 
                  key={option} 
                  className="flex items-center p-2 hover:bg-gray-50 rounded-md"
                >
                  <input
                    type="checkbox"
                    checked={filters.leadsnps.includes(option)}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...filters.leadsnps, option]
                        : filters.leadsnps.filter(val => val !== option);
                      setFilters({...filters, leadsnps: newValues});
                    }}
                    className="mr-2 rounded-sm text-blue-600"
                  />
                  <span className="text-sm">{option} variants</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Studies Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Studies Count</h4>
            <div className="space-y-2">
              {filterOptions.studies.map((option) => (
                <label 
                  key={option} 
                  className="flex items-center p-2 hover:bg-gray-50 rounded-md"
                >
                  <input
                    type="checkbox"
                    checked={filters.studies.includes(option)}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...filters.studies, option]
                        : filters.studies.filter(val => val !== option);
                      setFilters({...filters, studies: newValues});
                    }}
                    className="mr-2 rounded-sm text-blue-600"
                  />
                  <span className="text-sm">{option} studies</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-4 pt-3 border-t border-gray-200">
          <button
            onClick={() => setFilters({
              category: [],
              populations: [],
              leadsnps: [],
              studies: []
            })}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 text-center"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg text-center"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Main component to display the Lead Variants Table with mobile optimization
 */
const LeadVariantsTable = () => {
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'leadsnps', direction: 'desc' });
  const [filters, setFilters] = useState({
    category: [],
    populations: [],
    leadsnps: [],
    studies: []
  });
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const navigate = useNavigate();

  // Check screen size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      // Adjust items per page for mobile
      setItemsPerPage(window.innerWidth < 768 ? 5 : 10);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Get unique values for filters
  const filterOptions = {
    category: Array.from(new Set(groupedData.map(item => item.category))).sort(),
    populations: Array.from(new Set(groupedData.flatMap(item => item.cohorts))).sort(),
    leadsnps: Array.from(new Set(groupedData.map(item => item.variants.length.toString()))).sort((a, b) => Number(a) - Number(b)),
    studies: Array.from(new Set(groupedData.map(item => {
      const totalStudies = Object.values(item.studies_by_pop).reduce((a, b) => a + b, 0);
      return totalStudies.toString();
    }))).sort((a, b) => Number(a) - Number(b))
  };

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortValue = (item, key) => {
    switch (key) {
      case 'trait':
        return item.trait.name.toLowerCase();
      case 'category':
        return item.category.toLowerCase();
      case 'populations':
        return item.cohorts.length;
      case 'leadsnps':
        return item.variants.length;
      case 'studies':
        return Object.values(item.studies_by_pop).reduce((a, b) => a + b, 0);
      default:
        return item[key];
    }
  };

  // Data fetching logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/getLeadVariants`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const leadVariants = await response.json();
        
        // Process data with studies per population
        const processedData = leadVariants.reduce((acc, item) => {
          const key = item.trait.name;
          if (!acc[key]) {
            acc[key] = {
              trait: item.trait,
              category: item.category,
              cohorts: new Set(),
              variants: [],
              total_samples: 0,
              studies_by_pop: {}
            };
          }
          
          acc[key].cohorts.add(item.cohort);
          acc[key].variants.push(item);
          acc[key].total_samples += item.n_total;
          
          // Store studies count per population
          if (!acc[key].studies_by_pop[item.cohort]) {
            acc[key].studies_by_pop[item.cohort] = item.n_study;
          }
          
          return acc;
        }, {});
        
        setGroupedData(Object.values(processedData).map(group => ({
          ...group,
          cohorts: Array.from(group.cohorts)
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sort and filter data
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return groupedData;
    
    return [...groupedData].sort((a, b) => {
      const aValue = getSortValue(a, sortConfig.key);
      const bValue = getSortValue(b, sortConfig.key);
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [groupedData, sortConfig]);

  const filteredData = React.useMemo(() => {
    return sortedData.filter(item => {
      // Search term filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        item.trait.name?.toLowerCase().includes(searchLower) ||
        item.trait.description?.toLowerCase().includes(searchLower) ||
        item.category?.toLowerCase().includes(searchLower);

      // Column filters
      const matchesCategory = filters.category.length === 0 || 
        filters.category.includes(item.category);
      
      const matchesPopulations = filters.populations.length === 0 ||
        item.cohorts.some(cohort => filters.populations.includes(cohort));
      
      const matchesLeadSnps = filters.leadsnps.length === 0 ||
        filters.leadsnps.includes(item.variants.length.toString());
      
      const totalStudies = Object.values(item.studies_by_pop).reduce((a, b) => a + b, 0);
      const matchesStudies = filters.studies.length === 0 ||
        filters.studies.includes(totalStudies.toString());

      return matchesSearch && matchesCategory && matchesPopulations && 
             matchesLeadSnps && matchesStudies;
    });
  }, [sortedData, searchTerm, filters]);

  // Handlers
  const handleCohortClick = (traitName, cohort) => {
    navigate(`/gwas/${traitName}`, { state: { selectedCohort: cohort } });
  };

  const handleLeadSNPClick = async (data) => {
    try {
      const snpData = {
        SNP_ID: data.lead_snp.rsid,
        chromosome: data.lead_snp.position.chromosome,
        position: data.lead_snp.position.position
      };

      const url = `/api/phewas?snp=${snpData.SNP_ID}&chromosome=${snpData.chromosome}&position=${snpData.position}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const phewasData = await response.json();

      navigate('/phewas', { 
        state: { 
          phewasData: phewasData, 
          selectedSNP: snpData.SNP_ID,
          originalData: data
        } 
      });
    } catch (error) {
      console.error('Error fetching PheWAS data:', error);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Loading and error states
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
        Error loading data: {error}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Mobile Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:justify-between md:items-center">
          {/* Search Input - Full width on mobile */}
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by phenotype or trait..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-3 w-full md:w-80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Filter Button - Mobile only */}
          <div className="flex md:hidden">
            <button
              onClick={() => setShowFilterDrawer(true)}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-50 text-blue-600 rounded-lg border border-blue-100"
            >
              <Filter className="w-5 h-5" />
              <span>Filters {Object.values(filters).flat().length > 0 && `(${Object.values(filters).flat().length})`}</span>
            </button>
          </div>

          {/* Desktop Filter Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setFilters({...filters, category: []});
                  setShowFilterDrawer(true);
                }}
                className="flex items-center px-3 py-2 rounded-lg border bg-gradient-to-r from-emerald-500 to-green-500 text-white"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <span className="text-sm">Category</span>
                {filters.category.length > 0 && (
                  <span className="ml-2 bg-white text-green-600 px-2 rounded-full text-xs">
                    {filters.category.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setFilters({...filters, populations: []});
                  setShowFilterDrawer(true);
                }}
                className="flex items-center px-3 py-2 rounded-lg border bg-gradient-to-r from-blue-500 to-blue-600 text-white"
              >
                <Globe className="w-4 h-4 mr-2" />
                <span className="text-sm">Populations</span>
                {filters.populations.length > 0 && (
                  <span className="ml-2 bg-white text-blue-600 px-2 rounded-full text-xs">
                    {filters.populations.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results count and Sort - Mobile friendly */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            {filteredData.length} results
          </span>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Sort by:</span>
            <select
              value={sortConfig.key}
              onChange={(e) => handleSort(e.target.value)}
              className="text-xs border border-gray-200 rounded py-1 pl-2 pr-6 bg-white"
            >
              <option value="trait">Trait</option>
              <option value="category">Category</option>
              <option value="populations">Populations</option>
              <option value="leadsnps">Lead SNPs</option>
              <option value="studies">Studies</option>
            </select>
            
            <button
              onClick={() => setSortConfig({...sortConfig, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'})}
              className="p-1 rounded border border-gray-200"
            >
              <ArrowUpDown className={`w-4 h-4 ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Content: Table for desktop, Cards for mobile */}
      <div className="bg-gray-50 rounded-xl p-4">
        {/* Mobile Card View */}
        <div className={`${isMobile ? 'block' : 'hidden'}`}>
          {currentItems.map((item, idx) => (
            <MobileVariantCard 
              key={idx} 
              item={item} 
              onCohortClick={handleCohortClick}
              onLeadSNPClick={handleLeadSNPClick}
            />
          ))}
        </div>
        
        {/* Desktop Table View */}
        <div className={`${isMobile ? 'hidden' : 'block'} bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Trait</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Populations</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Lead SNPs</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Sample Sizes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Studies</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.map((group, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-semibold text-gray-900">{group.trait.name}</span>
                        <span className="text-xs text-gray-500">{group.trait.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100">
                        {group.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {group.cohorts.map((cohort, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleCohortClick(group.trait.name, cohort)}
                            className={`px-2 py-1 rounded-md text-xs font-medium ${getCohortStyle(cohort).tag}`}
                          >
                            {cohort}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold">
                        {group.variants.length} variants
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {group.cohorts.map((cohort, idx) => {
                          const variant = group.variants.find(v => v.cohort === cohort);
                          const size = variant ? variant.n_total : 0;
                          const maxSize = Math.max(...group.variants.map(v => v.n_total));
                          
                          return (
                            <div key={idx} className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className={`font-medium ${getCohortStyle(cohort).text}`}>{cohort}:</span>
                                <span className="text-gray-600">{new Intl.NumberFormat('en-US').format(size)}</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${getCohortStyle(cohort).bar}`}
                                  style={{ width: `${(size / maxSize) * 100}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {Object.entries(group.studies_by_pop).map(([pop, studyCount]) => (
                          <div key={pop} className="flex items-center justify-between">
                            <span className={`text-sm ${getCohortStyle(pop).text}`}>
                              {pop}:
                            </span>
                            <span className="text-sm text-gray-600">
                              {studyCount}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination - Mobile friendly */}
      <div className="flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <span className="hidden md:inline">First</span>
            <span className="md:hidden">«</span>
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <span className="hidden md:inline">Last</span>
            <span className="md:hidden">»</span>
          </button>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer 
        isOpen={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        filters={filters}
        setFilters={setFilters}
        filterOptions={filterOptions}
      />
    </motion.div>
  );
};

export default LeadVariantsTable;