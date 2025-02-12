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
  BarChart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Filter,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
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
 * Component to display statistical values with labels and icons.
 */
const StatCell = ({ value, label, icon: Icon }) => (
  <motion.div 
    className="flex flex-col space-y-1"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <span className="text-lg font-bold text-gray-900">
      {new Intl.NumberFormat('en-US').format(value)}
    </span>
    <div className="flex items-center space-x-1 text-xs text-gray-500">
      {Icon && <Icon className="w-3 h-3" />}
      <span>{label}</span>
    </div>
  </motion.div>
);

/**
 * Modified SampleSizeCell component with progress bars
 */
const SampleSizeCell = ({ variants }) => {
  const sampleSizes = variants.reduce((acc, variant) => {
    if (!acc[variant.cohort]) {
      acc[variant.cohort] = variant.n_total;
    }
    return acc;
  }, {});

  // Find the maximum sample size for scaling the bars
  const maxSize = Math.max(...Object.values(sampleSizes));

  return (
    <div className="space-y-2">
      {Object.entries(sampleSizes).map(([cohort, size], idx) => (
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
      ))}
    </div>
  );
};

/**
 * Updated CompactCohortCell component to show inline populations.
 */
const CompactCohortCell = ({ cohorts, onCohortClick, traitName }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {cohorts.map((cohort, idx) => (
        <motion.button
          key={idx}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCohortClick(traitName, cohort)}
          className={`px-2 py-1 rounded-md text-xs font-medium ${getCohortStyle(cohort).tag}`}
        >
          {cohort}
        </motion.button>
      ))}
    </div>
  );
};

/**
 * Updated CompactLeadSNPCell with population information
 */
const CompactLeadSNPCell = ({ variants, onLeadSNPClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Group variants by population
  const variantsByPopulation = variants.reduce((acc, variant) => {
    if (!acc[variant.cohort]) {
      acc[variant.cohort] = [];
    }
    acc[variant.cohort].push(variant);
    return acc;
  }, {});
  
  return (
    <div className="relative">
      <motion.div 
        className="relative group"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div 
          className="p-3 rounded-lg bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-900">{variants.length}</span>
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">variants</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </motion.div>
      
      {isExpanded && (
        <div 
          className="absolute left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-2 space-y-2 z-50"
          style={{ 
            maxHeight: '400px', 
            overflowY: 'auto',
            top: '100%'
          }}
        >
          {Object.entries(variantsByPopulation).map(([population, populationVariants], popIdx) => (
            <div key={popIdx} className="space-y-2">
              <div className={`text-xs font-semibold px-2 py-1 rounded ${getCohortStyle(population).text} bg-gray-50`}>
                {population} ({populationVariants.length} variants)
              </div>
              
              {populationVariants.map((variant, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    onLeadSNPClick(variant);
                    setIsExpanded(false);
                  }}
                  className="p-2 hover:bg-gray-50 rounded cursor-pointer ml-2 border-l-2 border-gray-100"
                >
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <MapPin className="w-3 h-3" />
                    <span>Chr{variant.lead_snp.position.chromosome}:{variant.lead_snp.position.position.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <Activity className="w-3 h-3" />
                    <span>Log10P: {variant.lead_snp.log10p.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">{variant.lead_snp.rsid}</div>
                  <div className="mt-1 flex items-center space-x-2 text-xs text-gray-600">
                    <FileText className="w-3 h-3" />
                    <span>Studies: {variant.n_study}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * New StudiesBreakdownCell component to show studies per population.
 */
const StudiesPerPopCell = ({ studies }) => (
    <div className="space-y-2">
      {Object.entries(studies).map(([pop, studyInfo]) => (
        <div key={pop} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-gray-400" />
            <span className={`text-sm ml-2 ${getCohortStyle(pop).text}`}>
              {pop}:
            </span>
          </div>
          <span className="text-sm -ml-2 right-2 text-gray-600">
            {studyInfo}
          </span>
        </div>
      ))}
    </div>
  );
const StudiesBreakdownCell = ({ popGwasData, studies }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="relative">
      <motion.div 
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">{studies} studies</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </motion.div>
      
      {isExpanded && (
        <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-lg border p-3 min-w-[200px]">
          {Object.entries(popGwasData).map(([pop, count]) => (
            <div key={pop} className="flex justify-between items-center py-1">
              <span className={`text-sm ${getCohortStyle(pop).text}`}>{pop}:</span>
              <span className="text-sm text-gray-600">{count} studies</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterPopover = ({ column, options, selectedValues, onChange, onClose, anchorRef }) => {
  const popoverRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState(300);
  
  useEffect(() => {
    if (anchorRef.current && popoverRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate available space below the anchor
      const spaceBelow = viewportHeight - anchorRect.bottom - 8;
      
      // Set position
      popoverRef.current.style.position = 'fixed';
      popoverRef.current.style.left = `${anchorRect.left}px`;
      popoverRef.current.style.top = `${anchorRect.bottom + 8}px`;
      
      // Set max height based on available space
      const calculatedMaxHeight = Math.min(400, spaceBelow - 16);
      setMaxHeight(calculatedMaxHeight);
    }

    // Prevent main page scroll when popover is open
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [anchorRef]);

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-10" 
        onClick={onClose}
        style={{ zIndex: 40 }}
      />
      <div 
        ref={popoverRef}
        className="fixed bg-white rounded-lg shadow-lg border border-gray-200"
        style={{ 
          zIndex: 50,
          width: '256px',
          maxHeight: `${maxHeight}px`,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header - Always visible */}
        <div className="flex justify-between items-center p-3 border-b border-gray-100 bg-white">
          <span className="text-sm font-medium text-gray-700">Filter {column}</span>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        {/* Scrollable content */}
        <div 
          className="overflow-y-auto flex-1 p-3"
          style={{
            overflowY: 'auto',
            overflowX: 'hidden',
            maxHeight: `${maxHeight - 56}px` // Subtract header height
          }}
        >
          <div className="space-y-2">
            {options.map((option, idx) => (
              <label 
                key={idx} 
                className="flex items-center space-x-2 hover:bg-gray-50 p-1 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, option]
                      : selectedValues.filter(val => val !== option);
                    onChange(newValues);
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};


const ColumnHeader = ({ title, onSort, sortConfig, onFilter, hasFilter = true, hasSort = true }) => {
  const [showFilter, setShowFilter] = useState(false);
  const filterButtonRef = useRef(null);
  
  return (
    <th className="px-6 py-3 text-left">
      <div className="flex items-center space-x-2">
        {hasSort ? (
          <div className="flex items-center space-x-1">
            <button 
              onClick={onSort}
              className="group flex items-center space-x-1 text-xs font-medium text-gray-500 hover:text-gray-700"
            >
              <span>{title}</span>
              <ArrowUpDown className={`w-4 h-4 ${
                sortConfig?.key === title.toLowerCase() 
                  ? 'text-blue-600' 
                  : 'text-gray-400 group-hover:text-gray-600'
              }`} />
            </button>
          </div>
        ) : (
          <span className="text-xs font-medium text-gray-500">{title}</span>
        )}
        
        {hasFilter && (
          <button
            ref={filterButtonRef}
            onClick={() => {
              setShowFilter(!showFilter);
              onFilter(filterButtonRef);
            }}
            className={`p-1 rounded-md hover:bg-gray-100 ${
              showFilter ? 'bg-blue-50 text-blue-600' : 'text-gray-400'
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
        )}
      </div>
    </th>
  );
};
/**
 * Main component to display the Lead Variants Table.
 */
const LeadVariantsTable = () => {
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'leadsnps', direction: 'desc' });
  const [filters, setFilters] = useState({
    category: [],
    populations: [],
    leadsnps: [],
    studies: []
  });
  const [activeFilter, setActiveFilter] = useState(null);
  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  const [filterAnchorRef, setFilterAnchorRef] = useState(null);

  const handleFilterClick = (columnKey, buttonRef) => {
    setFilterAnchorRef(buttonRef);
    setActiveFilter(activeFilter === columnKey ? null : columnKey);
  };
  const navigate = useNavigate();

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

  // Get unique values for filters
  const getFilterOptions = (key) => {
    const options = new Set();
    groupedData.forEach(item => {
      switch (key) {
        case 'category':
          options.add(item.category);
          break;
        case 'populations':
          item.cohorts.forEach(cohort => options.add(cohort));
          break;
        case 'leadsnps':
          options.add(item.variants.length.toString());
          break;
        case 'studies':
          const totalStudies = Object.values(item.studies_by_pop)
            .reduce((a, b) => a + b, 0);
          options.add(totalStudies.toString());
          break;
      }
    });
    return Array.from(options).sort();
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/getLeadVariants`);
        // const response = await fetch("/api/getLeadVariants");
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
              studies_by_pop: {}  // Track studies by population
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

  /**
   * Handler for cohort button clicks.
   */
  const handleCohortClick = (traitName, cohort) => {
    navigate(`/gwas/${traitName}`, { state: { selectedCohort: cohort } });
  };

  /**
   * Handler for Lead SNP clicks.
   */
  const handleLeadSNPClick = async (data) => {
    try {
      const snpData = {
        SNP_ID: data.lead_snp.rsid,
        chromosome: data.lead_snp.position.chromosome,
        position: data.lead_snp.position.position
      };

      const url = `/api/phewas?snp=${snpData.SNP_ID}&chromosome=${snpData.chromosome}&position=${snpData.position}`;
      // const url = `${baseURL}/phewas?snp=${snpData.SNP_ID}&chromosome=${snpData.chromosome}&position=${snpData.position}`;

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

  /**
   * Filter data based on search term.
   */
  // const filteredData = groupedData.filter(item => {
  //   const searchLower = searchTerm.toLowerCase();
  //   return (
  //     item.trait.name?.toLowerCase().includes(searchLower) ||
  //     item.trait.description?.toLowerCase().includes(searchLower) ||
  //     item.category?.toLowerCase().includes(searchLower)
  //   );
  // });

  /**
   * Pagination logic.
   */
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
      className="space-y-6"
    >
      {/* Search and Pagination Bar */}
      <motion.div 
        className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
      >
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by phenotype ID or trait..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 z-index 40 pr-4 py-2 w-80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {filteredData.length} results | Page {currentPage} of {totalPages}
          </span>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Lead Variants Table */}
      <motion.div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
              <tr>
                {[
                  { title: 'Trait', key: 'trait', hasFilter: false, hasSort: false },
                  { title: 'Category', key: 'category' },
                  { title: 'Populations', key: 'populations' },
                  { title: 'Lead SNPs', key: 'leadsnps' },
                  { title: 'Sample Sizes', key: 'samplesize', hasFilter: false },
                  { title: 'Studies', key: 'studies' }
                ].map(({ title, key, hasFilter = true, hasSort = true }) => (
                  <ColumnHeader
                    key={key}
                    title={title}
                    onSort={() => handleSort(key, hasSort)}
                    sortConfig={sortConfig}
                    hasFilter={hasFilter}
                    hasSort={hasSort}
                    onFilter={(buttonRef) => handleFilterClick(key, buttonRef)}
                  />
                ))}
              </tr>
            </thead>
        <tbody className="divide-y divide-gray-200">
          {currentItems.map((group, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {/* First 5 columns remain the same */}
              <td className="px-6 py-4">
                <motion.div className="flex flex-col space-y-1">
                  <span className="text-sm font-semibold text-gray-900">{group.trait.name}</span>
                  <span className="text-xs text-gray-500">{group.trait.description}</span>
                </motion.div>
              </td>

              <td className="px-6 py-4">
                <motion.span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100">
                  {group.category}
                </motion.span>
              </td>

              <td className="px-6 py-4">
                <CompactCohortCell 
                  cohorts={group.cohorts}
                  onCohortClick={handleCohortClick}
                  traitName={group.trait.name}
                />
              </td>

              <td className="px-6 py-4">
                <CompactLeadSNPCell 
                  variants={group.variants}
                  onLeadSNPClick={handleLeadSNPClick}
                />
              </td>

              <td className="px-6 py-4">
                <SampleSizeCell variants={group.variants} />
              </td>

              {/* Combined Studies per Population Column */}
              <td className="px-6 py-4">
                <StudiesPerPopCell studies={group.studies_by_pop} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

        </div>
      </motion.div>

      {/* Optional: Summary Stats Section */}
      {/* Uncomment the section below if you wish to include summary statistics */}
      {/*
      <motion.div 
        className="grid grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {[
          { label: 'Total Variants', value: filteredData.reduce((sum, item) => sum + item.variants.length, 0) },
          { label: 'Total Studies', value: filteredData.reduce((sum, item) => sum + Object.values(item.studies).reduce((a, b) => a + b, 0), 0) },
          { label: 'Total Samples', value: filteredData.reduce((sum, item) => sum + item.total_samples, 0) }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {new Intl.NumberFormat('en-US').format(stat.value)}
            </p>
          </motion.div>
        ))}
      </motion.div>
      */}
      {activeFilter && filterAnchorRef && (
        <FilterPopover
          column={activeFilter}
          options={getFilterOptions(activeFilter)}
          selectedValues={filters[activeFilter]}
          onChange={(newValues) => setFilters({ ...filters, [activeFilter]: newValues })}
          onClose={() => {
            setActiveFilter(null);
            setFilterAnchorRef(null);
          }}
          anchorRef={filterAnchorRef}
        />
      )}
    </motion.div>
  );
};

export default LeadVariantsTable;
