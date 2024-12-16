import React, { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { SearchBar } from '../components/SearchBar';
import { 
  Fingerprint,
  Network,
  Share2,
  Activity,
  Microscope,
  FlaskConical,  
  Database,
  Users,
  ChartBar,
  Search

} from 'lucide-react';
import { MessageSquare } from 'lucide-react';
import ChatInterface from './ChatInterface';
import { Loader2 } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LeadVariantsTable from '../components/GwasMetaTable';
import ResearchSection from '../components/ResearchSection';
// Shared cohort styling function

const AnimatedCounter = ({ end, duration = 8000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const startTime = useRef(null);

  const animate = (timestamp) => {
    if (!startTime.current) {
      startTime.current = timestamp;
    }

    const progress = timestamp - startTime.current;
    const percentage = Math.min(progress / duration, 1);
    const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
    const currentCount = Math.floor(end * easeOutQuart);

    setCount(currentCount);

    if (progress < duration) {
      countRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    countRef.current = requestAnimationFrame(animate);
    return () => {
      if (countRef.current) {
        cancelAnimationFrame(countRef.current);
      }
    };
  }, [end]);

  return <span>{count.toLocaleString()}</span>;
};

const StatCard = ({ icon: Icon, label, value, isVisible }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 transform translate-y-1/2">
      <div className="flex items-start gap-2">
        <span className="flex-shrink-0">
          <Icon className="w-4 h-4 text-gray-500 mt-1" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-gray-500 truncate">{label}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-blue-500 text-white text-xs font-medium px-2.5 py-1 rounded">
              Total
            </span>
            {/* Increased text size for the numbers */}
            <span className="text-2xl font-bold text-gray-900">
              {isVisible ? <AnimatedCounter end={value} /> : '0'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ metadata, projects }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  // Group by phenotype first to avoid double counting
  const totalStats = metadata.reduce((acc, item) => {
    if (!acc.phenoStats[item.phenotype_id]) {
      acc.phenoStats[item.phenotype_id] = {
        snps: new Set(),  // Use Set to track unique SNPs per phenotype
        maxSamples: 0     // Track maximum sample size across cohorts
      };
    }
    
    // For SNPs, add to the phenotype's set
    acc.phenoStats[item.phenotype_id].snps.add(item.num_snps);
    
    // For samples, keep the maximum across cohorts
    acc.phenoStats[item.phenotype_id].maxSamples = Math.max(
      acc.phenoStats[item.phenotype_id].maxSamples,
      item.num_samples || 0
    );
    
    return acc;
  }, { phenoStats: {} });

  // Calculate final totals
  const finalTotals = Object.values(totalStats.phenoStats).reduce(
    (acc, pheno) => ({
      snps: acc.snps + Math.max(...pheno.snps), // Take max SNPs per phenotype
      samples: acc.samples + pheno.maxSamples    // Sum up max samples per phenotype
    }),
    { snps: 0, samples: 0 }
  );

  return (
    <div 
      ref={cardRef} 
      className="grid grid-cols-3 mt-10 gap-6 px-4 max-w-7xl mx-auto"
    >
      <StatCard 
        icon={ChartBar}
        label="Phenotypes"
        value={projects.length}
        isVisible={isVisible}
      />
      <StatCard 
        icon={Database}
        label="SNPs"
        value={finalTotals.snps}
        isVisible={isVisible}
      />
      <StatCard 
        icon={Users}
        label="Sample Size"
        value={finalTotals.samples}
        isVisible={isVisible}
      />
    </div>
  );
};
// Update the header section of HomePage component:
const HeaderContent = ({ metadata, projects }) => {
  return (
    <div className="relative z-10">
      <div className="flex items-center mb-6">
        <Fingerprint className="mr-4 h-10 w-10 text-white" />
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
 
          </h1>
          <p className="text-blue-100 opacity-75">
            Explore genetic associations across multiple phenotypes
          </p>
        </div>
      </div>

      <StatsCard metadata={metadata} projects={projects} />
    </div>
  );
};


const CohortStats = ({ cohortData, phenotypeId, onCohortClick }) => {
  const maxValue = Math.max(...Object.entries(cohortData).map(([_, value]) => value));
  
  const sortedEntries = Object.entries(cohortData).sort((a, b) => {
    if (a[0] === 'META') return -1;
    if (b[0] === 'META') return 1;
    return a[0].localeCompare(b[0]);
  });

  const getCohortStyle = (cohort) => {
    const styles = {
      Meta: {
        tag: 'bg-gradient-to-r from-violet-500 to-purple-500 text-white',
        bar: 'bg-gradient-to-r from-violet-500/20 to-purple-500/20',
        text: 'text-violet-700'
      },
      EUR: {
        tag: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
        bar: 'bg-gradient-to-r from-blue-500/20 to-blue-600/20',
        text: 'text-blue-700'
      },
      EAS: {
        tag: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white',
        bar: 'bg-gradient-to-r from-emerald-500/20 to-green-600/20',
        text: 'text-emerald-700'
      },
      AFR: {
        tag: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
        bar: 'bg-gradient-to-r from-amber-500/20 to-orange-600/20',
        text: 'text-amber-700'
      },
      AMR: {
        tag: 'bg-gradient-to-r from-rose-500 to-red-600 text-white',
        bar: 'bg-gradient-to-r from-rose-500/20 to-red-600/20',
        text: 'text-rose-700'
      },
      default: {
        tag: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
        bar: 'bg-gradient-to-r from-gray-500/20 to-gray-600/20',
        text: 'text-gray-700'
      }
    };
    return styles[cohort] || styles.default;
  };

  return (
    <div className="space-y-3">
      {sortedEntries.map(([cohort, value]) => {
        const style = getCohortStyle(cohort);
        const percentage = (value / maxValue) * 100;
        
        return (
          <div 
            key={cohort}
            className="group relative"
          >
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onCohortClick(phenotypeId, cohort)}
                className={`
                  px-3 py-1 rounded-md text-xs font-medium min-w-[70px] text-center
                  shadow-sm transition-all duration-300 hover:scale-105 cursor-pointer
                  ${style.tag}
                `}
              >
                {cohort}
              </button>
              
              <div className="relative flex-grow h-8 rounded-md overflow-hidden bg-gray-50">
                <div 
                  className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out ${style.bar}`}
                  style={{ width: `${percentage}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-between px-3">
                  <span className={`text-sm font-medium ${style.text}`}>
                    {value.toLocaleString()}
                  </span>
                  <ChevronRight 
                    className={`w-4 h-4 transition-all duration-300 ${style.text} opacity-0 group-hover:opacity-100`}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const baseURL = process.env.FRONTEND_BASE_URL || 'http://localhost:5001/api'
const GWASMetadataTable = () => {
  const [metadata, setMetadata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(`${baseURL}/getGWASMetadata`);
        if (!response.ok) throw new Error('Failed to fetch metadata');
        const data = await response.json();
        setMetadata(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMetadata();
  }, []);

  const handleCohortClick = (phenotypeId, cohort) => {
    navigate(`/gwas/${phenotypeId}`, { state: { selectedCohort: cohort } });
  };

  const consolidateData = (data) => {
    const groupedData = data.reduce((acc, item) => {
      if (!acc[item.phenotype_id]) {
        acc[item.phenotype_id] = {
          phenotype_id: item.phenotype_id,
          phenotype_name: item.phenotype_name,
          cohorts: new Set(),
          snps_by_cohort: {},
          samples_by_cohort: {}
        };
      }
      acc[item.phenotype_id].cohorts.add(item.cohort);
      acc[item.phenotype_id].snps_by_cohort[item.cohort] = item.num_snps;
      acc[item.phenotype_id].samples_by_cohort[item.cohort] = item.num_samples;
      return acc;
    }, {});

    return Object.values(groupedData);
  };

  const filteredData = consolidateData(metadata).filter(item => 
    item.phenotype_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.phenotype_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
      {error}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search and Pagination Controls */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by phenotype ID or name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);  // Reset to first page when searching
          }}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-64 transition-shadow duration-200"
        />
        <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({filteredData.length} total)
          </span>
        <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                currentPage === 1 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                currentPage === totalPages 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
              }`}
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Table with fixed height */}
      <div className="border rounded-lg shadow-lg bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                  Phenotype ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]">
                  Phenotype Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                  Cohorts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[22.5%]">
                  SNPs by Cohort
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[22.5%]">
                  Sample Size by Cohort
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((item) => (
                <tr 
                  key={item.phenotype_id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {item.phenotype_id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 break-words">
                      {item.phenotype_name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {Array.from(item.cohorts).sort((a, b) => {
                        if (a === 'META') return -1;
                        if (b === 'META') return 1;
                        return a.localeCompare(b);
                      }).map(cohort => (
                        <button
                          key={cohort}
                          onClick={() => handleCohortClick(item.phenotype_id, cohort)}
                          className={`px-2 py-0.5 text-xs font-medium rounded-md 
                            transition-transform duration-200 hover:scale-105 cursor-pointer
                            ${getCohortStyle(cohort).tag}`}
                        >
                          {cohort}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <CohortStats 
                      cohortData={item.snps_by_cohort} 
                      phenotypeId={item.phenotype_id}
                      onCohortClick={handleCohortClick}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <CohortStats 
                      cohortData={item.samples_by_cohort}
                      phenotypeId={item.phenotype_id}
                      onCohortClick={handleCohortClick}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


const AnimatedDNA = () => (
  <div className="position-absolute end-0 top-0 h-100 w-25 overflow-hidden opacity-25">
    <svg viewBox="0 0 100 200" className="h-100 w-100">
      <path
        d="M30,10 Q50,50 30,90 Q10,130 30,170 Q50,210 30,250"
        stroke="rgba(255,255,255,0.5)"
        fill="none"
        strokeWidth="2"
      >
        <animate
          attributeName="d"
          dur="10s"
          repeatCount="indefinite"
          values="
            M30,10 Q50,50 30,90 Q10,130 30,170 Q50,210 30,250;
            M30,10 Q10,50 30,90 Q50,130 30,170 Q10,210 30,250;
            M30,10 Q50,50 30,90 Q10,130 30,170 Q50,210 30,250"
        />
      </path>
      <path
        d="M70,10 Q50,50 70,90 Q90,130 70,170 Q50,210 70,250"
        stroke="rgba(255,255,255,0.7)"
        fill="none"
        strokeWidth="2"
      >
        <animate
          attributeName="d"
          dur="10s"
          repeatCount="indefinite"
          values="
            M70,10 Q50,50 70,90 Q90,130 70,170 Q50,210 70,250;
            M70,10 Q90,50 70,90 Q50,130 70,170 Q90,210 70,250;
            M70,10 Q50,50 70,90 Q90,130 70,170 Q50,210 70,250"
        />
      </path>
    </svg>
  </div>
);

const getCohortStyle = (cohort) => {
  const styles = {
    Meta: {
      tag: 'bg-gradient-to-r from-violet-500 to-purple-500 text-white',
      bar: 'bg-gradient-to-r from-violet-500/20 to-purple-500/20',
      text: 'text-violet-700'
    },
    EUR: {
      tag: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
      bar: 'bg-gradient-to-r from-blue-500/20 to-blue-600/20',
      text: 'text-blue-700'
    },
    EAS: {
      tag: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white',
      bar: 'bg-gradient-to-r from-emerald-500/20 to-green-600/20',
      text: 'text-emerald-700'
    },
    AFR: {
      tag: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
      bar: 'bg-gradient-to-r from-amber-500/20 to-orange-600/20',
      text: 'text-amber-700'
    },
    AMR: {
      tag: 'bg-gradient-to-r from-rose-500 to-red-600 text-white',
      bar: 'bg-gradient-to-r from-rose-500/20 to-red-600/20',
      text: 'text-rose-700'
    },
    default: {
      tag: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
      bar: 'bg-gradient-to-r from-gray-500/20 to-gray-600/20',
      text: 'text-gray-700'
    }
  };
  return styles[cohort] || styles.default;
};
const SearchSection = ({ projects }) => {
  return (
    <div className="max-w-2xl mx-auto mt-20">
      <div className="bg-white rounded-xl shadow-xl p-6 transform transition-all duration-300 hover:shadow-2xl">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Search Database
              </h3>
              <p className="text-sm text-gray-500">
                Find genetic associations across phenotypes
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <label 
              htmlFor="search-input" 
              className="block text-sm font-medium text-gray-700"
            >
              Search for a gene, SNP, or phenotype:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <SearchBar 
                items={projects}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg 
                          bg-white shadow-sm focus:outline-none focus:ring-2 
                          focus:ring-blue-500 focus:border-blue-500
                          text-sm placeholder-gray-400
                          transition duration-150 ease-in-out"
                placeholder="Type to search..."
              />
            </div>
            
            {/* Quick Filters */}
            <div className="flex gap-2 mt-4 flex-wrap">
              <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 
                               rounded-full hover:bg-blue-100 transition-colors duration-200">
                Genes
              </button>
              <button className="px-3 py-1 text-xs font-medium text-purple-600 bg-purple-50 
                               rounded-full hover:bg-purple-100 transition-colors duration-200">
                SNPs
              </button>
              <button className="px-3 py-1 text-xs font-medium text-emerald-600 bg-emerald-50 
                               rounded-full hover:bg-emerald-100 transition-colors duration-200">
                Phenotypes
              </button>
            </div>

            {/* Search Tips */}
            <div className="mt-4 text-xs text-gray-500">
              <p>
                <span className="font-medium">Pro tip:</span> Use quotes for exact matches, 
                e.g., "rs1234" or "Type 2 Diabetes"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export const HomePage = () => {
  const [metadata, setMetadata] = useState([]);
  const [projects, setProjects] = useState([]);
  const formStyle = { width: '300px' };
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(`${baseURL}/getGWASMetadata`);
        if (!response.ok) throw new Error('Failed to fetch metadata');
        const data = await response.json();
        
        // Transform metadata into projects format
        const uniquePhenotypes = [...new Set(data.map(item => item.phenotype_id))];
        const projectsData = uniquePhenotypes.map((phenoId, idx) => {
          const phenoMetadata = data.filter(item => item.phenotype_id === phenoId);
          return {
            id: idx,
            name: phenoId,
            type: 'gwas',
            cohorts: phenoMetadata.map(item => item.cohort)
          };
        });
        
        setProjects(projectsData);
        setMetadata(data);
      } catch (err) {
        console.error('Error fetching metadata:', err);
      }
    };

    fetchMetadata();
  }, []);

  return (
    <>
      <div className="relative">
        {/* Gradient Background */}
        <div
          className="w-full pb-32 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #4F46E5 0%, #2563EB 100%)',
            borderRadius: '0 0 2rem 2rem'
          }}
        >
          {/* Header content */}
          <div className="max-w-7xl mx-auto px-4 pt-8">
            <div className="flex items-center">
              {/* Replace Fingerprint with Network icon */}
              <Network className="mr-4 h-10 w-10 text-white" />
              <div>
                {/* Update the title to "PLATLAS" */}
                <h1 className="text-4xl font-bold text-white mb-2">
                  PLATLAS
                </h1>
                <p className="text-blue-100 opacity-75">
                  Advancing genomic research through cutting-edge data visualization and analysis tools.
                </p>
              </div>
            </div>
            <button
      onClick={() => setIsChatOpen(true)}
      className="flex items-center space-x-2 px-4 py-2 bg-white/10 
                 hover:bg-white/20 rounded-lg text-white transition-all
                 border border-white/20 backdrop-blur-sm"
    >
      <MessageSquare className="w-5 h-5" />
      <span>Ask AI Assistant</span>
    </button>
          </div>

          <AnimatedDNA />
          
          <Network 
            className="absolute left-[10%] top-[20%] opacity-20"
            size={30}
            color="white"
            style={{
              animation: 'float 6s ease-in-out infinite'
            }}
          />
          <Share2 
            className="absolute right-[15%] bottom-[30%] opacity-20"
            size={24}
            color="white"
            style={{
              animation: 'float 6s ease-in-out infinite 1s'
            }}
          />
        </div>

        {/* Stats Cards */}
        <div className="relative -mt-36 mb-8">
          <StatsCard metadata={metadata} projects={projects} />
        </div>

        <div className="max-w-7xl mx-auto px-4">
          {/* Replace the old Card with the new SearchSection */}
          <SearchSection projects={projects} />
          
          <div className="container mx-auto p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Available GWAS Studies
            </h2>
            <LeadVariantsTable />
          </div>
          <ResearchSection/>
        </div>
      </div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

<ChatInterface 
  isOpen={isChatOpen} 
  onClose={() => setIsChatOpen(false)} 
/>
    </>
  );
};
