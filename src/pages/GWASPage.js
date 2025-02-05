import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal'; // Import Modal for pop-up
import Button from 'react-bootstrap/Button'; // Import Button for Modal
import { Manhattan } from '../plots/Manhattan';
import { QQ } from '../plots/QQ';
import { TopResults } from '../plots/TopResults';
import { Hudson } from '../plots/Hudson';
import { OptionBar } from '../components/OptionBar';
import AncestryFilter from '../components/CohortFilters';
import PheWASPlot from '../plots/PheWASPlot';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { FaInfoCircle, FaChartLine, FaChartBar } from 'react-icons/fa';
import {
  RefreshCcw,
  Search,
  TrendingUp,
  Target,
  ShoppingBag,
  Share2,
  AlertCircle,
  Clock,
  Car,
  BarChart3,
  ExternalLink,
  Info,
  ClipboardCheck,
  Users,
  BarChart2,
  Network,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { Database, ChevronRight } from 'lucide-react';
import RelatedPhenotypesSidebar from '../components/RelatedPhenotypesSidebar';
import LeadVariantStats from '../components/LeadVariantsStats';
const baseURL = process.env.FRONTEND_BASE_URL || 'http://localhost:5001/api'

const AnimatedDNA = () => (
  <div className="absolute right-0 top-0 h-full w-1/4 overflow-hidden opacity-25">
    <svg viewBox="0 0 100 200" className="h-full w-full">
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

const StatsBar = ({ phenoStats, leadVariants }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Calculate total SNPs (taking the first cohort's value since they're all the same)
  const totalSNPs = Object.values(phenoStats.snps_by_cohort || {})[0] || 0;
  
  // Calculate total sample size (taking the first cohort's value since they're all the same)
  const totalSampleSize = Object.values(phenoStats.samples_by_cohort || {})[0] || 0;

  return (
    <div className="grid grid-cols-3 gap-8 p-6 bg-white rounded-lg shadow-lg -mt-10 mx-4 relative z-10">
      {/* Total SNPs */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
          <Database className="w-4 h-4" />
          SNPs Size
        </h3>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium">
            {totalSNPs.toLocaleString()} SNPs
          </span>
        </div>
      </div>

      {/* Total Sample Size */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Sample Size
        </h3>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-medium">
            {totalSampleSize.toLocaleString()} samples
          </span>
        </div>
      </div>

      {/* Lead Variants */}
      <div className="relative">
        <div className="space-y-4">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between text-sm font-semibold text-gray-600 hover:text-gray-800"
          >
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Lead Variants ({leadVariants?.length || 0})
            </div>
            {isDropdownOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 p-4 z-50 max-h-64 overflow-y-auto">
              <div className="space-y-3">
                {leadVariants?.map((variant, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-200">
                        {variant.cohort}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {variant.rsid}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 pl-2 flex items-center gap-4">
                      <span>-log10(p): {variant.log10p.toFixed(2)}</span>
                      <span>• {variant.n_study} studies</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const GWASHeader = ({ phenoId, cohorts, selectedCohort, setSelectedCohort, phenoStats, onOpenSidebar, leadVariants, selectedStudy }) => {
  return (
    <div className="relative w-full">
      <div 
        className="w-full relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #2563EB 100%)',
          borderRadius: '0 0 2rem 2rem'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          {/* Title and Icon Row with Sidebar Toggle */}
          <div className="flex items-center mb-6">
            {/* Add sidebar toggle button */}
            <button
              onClick={onOpenSidebar}
              className="mr-6 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors group"
              title="View related phenotypes"
            >
              <div className="space-y-1.5">
                <div className="w-6 h-0.5 bg-white group-hover:scale-x-90 transition-transform origin-left"></div>
                <div className="w-6 h-0.5 bg-white"></div>
                <div className="w-6 h-0.5 bg-white group-hover:scale-x-90 transition-transform origin-left"></div>
              </div>
            </button>

            <BarChart2 className="mr-4 h-10 w-10 text-white" />
            
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                GWAS Analysis Page
              </h1>
              <div className="flex items-center space-x-2">
                <span className="text-blue-100 text-lg">Phenotype: </span>
                <div className="flex items-center bg-white/20 rounded-lg overflow-hidden">
                  <span className="px-4 py-2 text-white font-semibold text-lg">
                    {phenoId}
                  </span>
                </div>
              </div>
            </div>
          </div>
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

      <div className="max-w-7xl mx-auto">
        <StatsBar phenoStats={phenoStats} leadVariants={leadVariants} />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

const StudySelector = ({
  selectedStudy,
  selectedCohort,
  onChange,
  setSelectedCohort,
  setSelectedTopAncestry,    // Add this
  setSelectedBottomAncestry, // Add this
  phenoId,
  availableStudies,
  gwamaCohorts,
  mrmegaAvailable,
  gwamaAvailable
}) => {
  // No fetching here anymore. We rely on data passed from GWASPage.

  const handleStudyChange = (newStudy) => {
    if (newStudy === 'mrmega') {
      setSelectedCohort('ALL');
      // Also update Hudson plot cohorts for MR-MEGA
      setSelectedTopAncestry('ALL');
      setSelectedBottomAncestry('ALL');
    } else {
      // If we have gwama cohorts available, set the first one if needed
      if (gwamaCohorts.length > 0) {
        setSelectedCohort(gwamaCohorts[0]);
        // Set initial Hudson plot cohorts for GWAMA
        if (gwamaCohorts.length >= 2) {
          setSelectedTopAncestry(gwamaCohorts[0]);
          setSelectedBottomAncestry(gwamaCohorts[1]);
        } else {
          setSelectedTopAncestry(gwamaCohorts[0]);
          setSelectedBottomAncestry(gwamaCohorts[0]);
        }
      } else {
        setSelectedCohort(null);
      }
    }
    onChange(newStudy);
  };

  return (
    <div className="space-y-4">
      {/* Study Type Selection */}
      <div className="flex flex-col space-y-2">
        <span className="text-sm font-medium text-gray-700">Study Type:</span>
        <div className="flex space-x-2">
          <button
            onClick={() => handleStudyChange('gwama')}
            disabled={!gwamaAvailable}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedStudy === 'gwama'
                ? 'bg-blue-600 text-white'
                : gwamaAvailable
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            GWAMA
          </button>
          <button
            onClick={() => handleStudyChange('mrmega')}
            disabled={!mrmegaAvailable}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedStudy === 'mrmega'
                ? 'bg-blue-600 text-white'
                : mrmegaAvailable
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            MR-MEGA
          </button>
        </div>
      </div>

      {/* Cohort Selection - Only shown for GWAMA */}
      {selectedStudy === 'gwama' && gwamaCohorts.length > 0 && (
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-medium text-gray-700">Select Cohort:</span>
          <div className="flex flex-wrap gap-2">
            {gwamaCohorts.map((cohort) => (
              <button
                key={cohort}
                onClick={() => setSelectedCohort(cohort)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCohort === cohort
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cohort}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const GWASPage = () => {
  const { phenoId } = useParams();
  const [selectedPval, setSelectedPval] = useState('1e-05'); // Default pval threshold
  const [selectedStudy, setSelectedStudy] = useState('gwama');
  const [selectedCohort, setSelectedCohort] = useState(null); // Initialize as null
  const [selectedSNP, setSelectedSNP] = useState(null);
  const [statData, setStatData] = useState([]);
  const [dynData, setDynData] = useState([]);
  const [ticks, setTicks] = useState([]);
  const [qq, setQQ] = useState(null);
  const [about, setAbout] = useState([]);
  const [tab, setTab] = useState('about');
  const [dynTop, setDynTop] = useState([]);
  const [statTop, setStatTop] = useState([]);
  const [dynBott, setDynBott] = useState([]);
  const [statBott, setStatBott] = useState([]);
  const [ticksTop, setTicksTop] = useState([]);
  const [ticksBott, setTicksBott] = useState([]);
  const [qqComp, setQQComp] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topResults, setTopResults] = useState([]);
  const [selectedAncestry, setSelectedAncestry] = useState('EUR');
  const [loadingTop, setLoadingTop] = useState(false);
  const [loadingBottom, setLoadingBottom] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  const [logPval, setLogPval] = useState(-Math.log10(parseFloat('0.00000001'))); 
  const [cachedData, setCachedData] = useState({
    cohortData: {}, 
    bottomPlots: {},
    topPlots: {}
  });
  const [selectedTopAncestry, setSelectedTopAncestry] = useState('EUR');
  const [selectedBottomAncestry, setSelectedBottomAncestry] = useState('AFR');
  const [phenoStats, setPhenoStats] = useState({
    snps_by_cohort: {},
    samples_by_cohort: {}
  });
  const [leadVariants, setLeadVariants] = useState([]);
  const [availableStudies, setAvailableStudies] = useState([]);
  const [gwamaCohorts, setGwamaCohorts] = useState([]);
  const [gwamaAvailable, setGwamaAvailable] = useState(false);
  const [mrmegaAvailable, setMrmegaAvailable] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const history = useNavigate();

  const fetchHudsonTopData = async (ancestry) => {
    try {
      setLoadingTop(true);
      // const response = await fetch(
      //   `${baseURL}/queryGWASData?cohortId=${ancestry}&phenoId=${phenoId}&study=${selectedStudy}`
      // );
      const response = await fetch(
        `/api/queryGWASData?cohortId=${ancestry}&phenoId=${phenoId}&study=${selectedStudy}`
      );
      
      
      if (!response.ok) {
        setDynTop([]);
        setStatTop([]);
        setTicksTop([]);
        return;
      }

      const data = await response.json();
      const processData = (data) => {
        return Object.entries(data).flatMap(([chrom, snps]) =>
          snps.map((snp) => {
            const pVal = parseFloat(snp.p);
            return {
              chrom: parseInt(chrom),
              pos: snp.pos,
              log_p: -Math.log10(snp.p),
              pval: pVal,
              SNP_ID: snp.id || null
            };
          })
        );
      };

      const dfTop = processData(data);
      const { dyn: newDynTop, stat: newStatTop, ticks: newTicksTop } = generatePlotData(dfTop);
      
      setDynTop(newDynTop);
      setStatTop(newStatTop);
      setTicksTop(newTicksTop);

    } catch (error) {
      console.error('Failed to fetch or process Hudson top data:', error);
      setDynTop([]);
      setStatTop([]);
      setTicksTop([]);
    } finally {
      setLoadingTop(false);
    }
  };

  // Modify the fetchHudsonBottomData function
  const fetchHudsonBottomData = async (ancestry) => {
    try {
      setLoadingBottom(true);
      // const response = await fetch(
      //   `${baseURL}/queryGWASData?cohortId=${ancestry}&phenoId=${phenoId}&study=${selectedStudy}`
      // );
      const response = await fetch(
        `/api/queryGWASData?cohortId=${ancestry}&phenoId=${phenoId}&study=${selectedStudy}`
      );
      
      if (!response.ok) {
        setDynBott([]);
        setStatBott([]);
        setTicksBott([]);
        return;
      }

      const data = await response.json();
      const processData = (data) => {
        return Object.entries(data).flatMap(([chrom, snps]) =>
          snps.map((snp) => {
            const pVal = parseFloat(snp.p);
            return {
              chrom: parseInt(chrom),
              pos: snp.pos,
              log_p: -Math.log10(snp.p),
              pval: pVal,
              SNP_ID: snp.id || null
            };
          })
        );
      };
      
      const dfBott = processData(data);
      const { dyn: newDynBott, stat: newStatBott, ticks: newTicksBott } = generatePlotData(dfBott);
      
      setDynBott(newDynBott);
      setStatBott(newStatBott);
      setTicksBott(newTicksBott);

    } catch (error) {
      console.error('Failed to fetch or process Hudson bottom data:', error);
      setDynBott([]);
      setStatBott([]);
      setTicksBott([]);
    } finally {
      setLoadingBottom(false);
    }
  };

  useEffect(() => {
    const fetchLeadVariants = async () => {
      try {
        // const response = await fetch(`${baseURL}/getLeadVariants`);
        const response = await fetch(`/api/getLeadVariants`);

        if (!response.ok) throw new Error('Failed to fetch data');
        const allVariants = await response.json();
        
        // Filter variants for current phenotype
        const relevantVariants = allVariants
          .filter(variant => variant.trait.name === phenoId)
          .map(variant => ({
            cohort: variant.cohort,
            rsid: variant.lead_snp.rsid,
            log10p: variant.lead_snp.log10p,
            n_study: variant.n_study
          }));

        setLeadVariants(relevantVariants);
      } catch (error) {
        console.error('Error fetching lead variants:', error);
      }
    };

    if (phenoId) {
      fetchLeadVariants();
    }
  }, [phenoId]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handlePvalChange = (pval) => {
    setSelectedPval(pval);
    setLogPval(-Math.log10(parseFloat(pval))); 
    fetchGWASData(selectedCohort, pval);
  };

  useEffect(() => {
    const fetchHudsonData = async () => {
      if (tab === 'hudson') {
        // Reset the plots when switching to Hudson tab or changing study
        setDynTop([]);
        setStatTop([]);
        setTicksTop([]);
        setDynBott([]);
        setStatBott([]);
        setTicksBott([]);
          
        if (selectedTopAncestry) {
          await fetchHudsonTopData(selectedTopAncestry);
        }
        if (selectedBottomAncestry) {
          await fetchHudsonBottomData(selectedBottomAncestry);
        }
      }
    };
  
    fetchHudsonData();
  }, [tab, selectedStudy, selectedTopAncestry, selectedBottomAncestry]); // Added selectedStudy as dependency

  // Fetch /findfiles once in GWASPage
  useEffect(() => {
    const fetchAvailableStudiesAndCohorts = async () => {
      if (!phenoId) return;
      try {
        setLoading(true);
        // const response = await fetch(`${baseURL}/findfiles?phenoId=${phenoId}`);
        const response = await fetch(`/api/findfiles?phenoId=${phenoId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch available studies and cohorts');
        }

        const data = await response.json();
        const { gwamaAvailable: gAvail, mrmegaAvailable: mAvail, gwamaCohorts: gCohorts } = data;

        setGwamaAvailable(gAvail);
        setMrmegaAvailable(mAvail);
        
        const studies = [];
        if (gAvail) studies.push('gwama');
        if (mAvail) studies.push('mrmega');
        setAvailableStudies(studies);
        setGwamaCohorts(gCohorts);

        // Set default study and cohort
        if (gAvail && gCohorts.length > 0) {
          setSelectedStudy('gwama');
          setSelectedCohort(gCohorts[0]);
          // Initialize top/bottom ancestry for Hudson if needed
          if (gCohorts.length >= 2) {
            setSelectedTopAncestry(gCohorts[0]);
            setSelectedBottomAncestry(gCohorts[1]);
          } else {
            setSelectedTopAncestry(gCohorts[0]);
            setSelectedBottomAncestry(gCohorts[0]);
          }
        } else if (mAvail) {
          setSelectedStudy('mrmega');
          setSelectedCohort('ALL');
          setSelectedTopAncestry('ALL');
          setSelectedBottomAncestry('ALL');
        }

      } catch (err) {
        console.error('Error fetching studies and cohorts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableStudiesAndCohorts();
  }, [phenoId]);

  // Load metadata for the cohort and phenotype
  useEffect(() => {
const loadMetadata = async () => {
  try {
    setLoading(true);
    // const response = await fetch(`${baseURL}/getPhenotypeStats/${phenoId}`);  // Changed this line
    const response = await fetch(`/api/getPhenotypeStats/${phenoId}`);  // Changed this line
    
    if (!response.ok) throw new Error('Failed to fetch metadata');
    const data = await response.json();
    
    // Data will now be directly for the specific phenotype, no need to filter
    if (data) {
      // Set cohorts from the populations in data
      const availableCohorts = Object.keys(data.stats.snps_by_cohort || {});
      setCohorts(availableCohorts);
      if (!selectedCohort && availableCohorts.length > 0) {
        setSelectedCohort(availableCohorts[0]);
      }

      // Set phenotype stats directly
      setPhenoStats(data.stats);
      
      setAbout([{
        Info: `Phenotype: ${data.phenotype_id}`,
        Description: `Available in ${availableCohorts.length} cohorts: ${availableCohorts.join(', ')}`
      }]);
    } else {
      console.error('No metadata found for phenotype:', phenoId);
      handleShowModal();
    }
  } catch (error) {
    console.error('Error loading metadata:', error);
    handleShowModal();
  } finally {
    setLoading(false);
  }
};
    
    loadMetadata();
  }, [phenoId]);

  // Fetch GWAS data based on the selected cohort and p-value
  const fetchGWASData = async (cohortId, pval) => {
    const cacheKey = `${cohortId}_${pval}_${selectedStudy}`;
    
    if (cachedData.cohortData[cacheKey]) {
      processGWASData(cachedData.cohortData[cacheKey]);
      return;
    }

    try {
      setLoading(true);
      // const response = await fetch(
      //   `${baseURL}/queryGWASData?cohortId=${cohortId}&phenoId=${phenoId}&pval=${pval}&study=${selectedStudy}`
      // );
      const response = await fetch(
        `/api/queryGWASData?cohortId=${cohortId}&phenoId=${phenoId}&pval=${pval}&study=${selectedStudy}`
      );
      if (response.status === 404) {
        handleShowModal();
        setDynData([]);
        setStatData([]);
        setTicks([]);
        setQQ(null);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data)
      setCachedData((prevData) => ({
        ...prevData,
        cohortData: {
          ...prevData.cohortData,
          [cacheKey]: data,
        },
      }));

      processGWASData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      handleShowModal();
    } finally {
      setLoading(false);
    }
  };

  // Fetch top results with caching
  const fetchTopResults = async (cohortId) => {
    const cacheKey = `${cohortId}_topResults_${selectedStudy}`;
    
    if (cachedData.cohortData[cacheKey]) {
      setTopResults(cachedData.cohortData[cacheKey]);
      return;
    }

    try {
      setLoading(true);
      // const url = `${baseURL}/getTopResults?cohortId=${cohortId}&phenoId=${phenoId}&study=${selectedStudy}`;
      const url = `/api/getTopResults?cohortId=${cohortId}&phenoId=${phenoId}&study=${selectedStudy}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setTopResults(data);
        setCachedData((prevData) => ({
          ...prevData,
          cohortData: {
            ...prevData.cohortData,
            [cacheKey]: data,
          },
        }));
      } else {
        setTopResults([]);
      }
    } catch (error) {
      console.error('Failed to fetch top results:', error);
      setTopResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSNPClick = async (snpData) => {
    setSelectedSNP(snpData);
    try {
        // const url = `${baseURL}/phewas?snp=${snpData.SNP_ID}&chromosome=${snpData.chromosome}&position=${snpData.position}&study=${selectedStudy}`;
        const url = `/api/phewas?snp=${snpData.SNP_ID}&chromosome=${snpData.chromosome}&position=${snpData.position}&study=${selectedStudy}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        history('/phewas', { 
            state: { 
                phewasData: data, 
                selectedSNP: snpData.SNP_ID,
                study: selectedStudy 
            } 
        });
    } catch (error) {
        console.error('Error fetching PheWAS data:', error);
    }
  };

  const processGWASData = (data) => {
    const df = Object.entries(data).flatMap(([chrom, snps]) =>
        snps.map((snp) => ({
            chrom: parseInt(chrom),
            pos: snp.pos,
            log_p: -Math.log10(snp.p),
            pval: snp.p,
            SNP_ID: snp.id
        }))
    );

    generateQQData(df);
    const { dyn, stat, ticks } = generatePlotData(df);
    setDynData(dyn);
    setStatData(stat);
    setTicks(ticks);
  };

  const generateQQData = (df) => {
    console.log(df)
    const n = df.length;
    const observed = df.map((row) => row.log_p).sort((a, b) => a - b);
    const theoretical = Array.from({ length: n }, (_, i) => -Math.log10((i + 0.5) / n)).sort((a, b) => a - b);
    setQQ({ x: theoretical, y: observed });
  };

  const generatePlotData = (df) => {
    const pvalThreshold = parseFloat(selectedPval);
    const numChromosomes = 22;
    const dyn_out = [];
    const stat_out = [];
    const ticks = [];

    const chromLengths = [
        248956422, 242193529, 198295559, 190214555, 181538259, 170805979,
        159345973, 145138636, 138394717, 133797422, 135086622, 133275309,
        114364328, 107043718, 101991189, 90338345, 83257441, 80373285,
        58617616, 64444167, 46709983, 50818468
    ];
    const cumulativeSums = chromLengths.reduce((acc, val, i) => {
        acc[i + 1] = (acc[i] || 0) + val;
        return acc;
    }, {});

    const totalLength = cumulativeSums[numChromosomes];

    for (let chrom = 1; chrom <= numChromosomes; chrom++) {
        const df_chr = df.filter((row) => row.chrom === chrom);

        if (df_chr.length > 0) {
            const startPos = chrom === 1 ? 0 : cumulativeSums[chrom - 1] / totalLength;
            const endPos = cumulativeSums[chrom] / totalLength;
            ticks.push((startPos + endPos) / 2);

            const normalizePos = (pos) => {
                const chromStart = chrom === 1 ? 0 : cumulativeSums[chrom - 1];
                return (chromStart + pos) / totalLength;
            };

            const dyn_chr = df_chr.filter((row) => row.pval <= pvalThreshold);
            const stat_chr = df_chr.filter((row) => row.pval > pvalThreshold);

            if (dyn_chr.length > 0) {
                dyn_out.push({
                    x: dyn_chr.map((row) => normalizePos(row.pos)),
                    y: dyn_chr.map((row) => row.log_p),
                    chr: chrom,
                    SNP_ID: dyn_chr.map((row) => row.SNP_ID),
                    pos: dyn_chr.map((row) => row.pos)
                });
            }

            if (stat_chr.length > 0) {
                stat_out.push({
                    x: stat_chr.map((row) => normalizePos(row.pos)),
                    y: stat_chr.map((row) => row.log_p),
                    chr: chrom,
                    SNP_ID: stat_chr.map((row) => row.SNP_ID),
                    pos: stat_chr.map((row) => row.pos)
                });
            }
        }
    }

    return { dyn: dyn_out, stat: stat_out, ticks };
};

useEffect(() => {
  if (tab === 'man' && selectedStudy && 
      ((selectedStudy === 'mrmega' && selectedCohort === 'ALL') || 
       (selectedStudy === 'gwama' && selectedCohort && selectedCohort !== 'ALL'))) {
    fetchGWASData(selectedCohort, selectedPval);
    fetchTopResults(selectedCohort);
  }
}, [selectedCohort, selectedStudy, tab, selectedPval]);

return (
  <div className="min-h-screen bg-gray-50">
    <RelatedPhenotypesSidebar
      currentPhenoId={phenoId}
      isOpen={sidebarOpen}
      onClose={() => setSidebarOpen(false)}
    />

    {/* Modal Component */}
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        showModal ? "visible bg-gray-800 bg-opacity-50" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Unavailable</h2>
        <p className="text-gray-600 mb-4">No data found for the selected parameters:</p>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>Cohort: {selectedCohort}</li>
          <li>Phenotype: {phenoId}</li>
          <li>P-value Threshold: {selectedPval}</li>
        </ul>
        <p className="text-gray-600 mb-4">
          Please try different parameters or contact the system administrator if you believe this is an error.
        </p>
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          onClick={handleCloseModal}
        >
          Close
        </button>
      </div>
    </div>

    {loading && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="flex items-center space-x-2">
          <Spinner animation="border" role="status" />
          <span className="text-white">Loading...</span>
        </div>
      </div>
    )}

    <div className="w-full">
      <GWASHeader 
        phenoId={phenoId}
        cohorts={cohorts}
        selectedCohort={selectedCohort}
        setSelectedCohort={setSelectedCohort}
        phenoStats={phenoStats}
        onOpenSidebar={() => setSidebarOpen(true)}
        leadVariants={leadVariants}
        selectedStudy={selectedStudy}
      />
    </div>

    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="mb-6">
          <StudySelector
            selectedStudy={selectedStudy}
            selectedCohort={selectedCohort}
            onChange={setSelectedStudy}
            setSelectedCohort={setSelectedCohort}
            setSelectedTopAncestry={setSelectedTopAncestry}       // Add this
            setSelectedBottomAncestry={setSelectedBottomAncestry} // Add this
            phenoId={phenoId}
            availableStudies={availableStudies}
            gwamaCohorts={gwamaCohorts}
            mrmegaAvailable={mrmegaAvailable}
            gwamaAvailable={gwamaAvailable}
          />
        </div>
        <Tabs activeKey={tab} onSelect={(e) => setTab(e)} variant="pills" justify>
          <Tab eventKey="about" title="About">
            <div className="p-4">
              {Array.isArray(about) && about.length > 0 ? (
                about.map((d, index) => (
                  <div key={index} className="mb-4 border-b pb-2">
                    <h3 className="text-lg font-bold text-gray-800">{d.Info}</h3>
                    <p className="text-gray-600">{d.Description}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No data available for the selected cohort.</p>
              )}
            </div>
          </Tab>

          <Tab eventKey="man" title="Analysis">
            <div className="space-y-6">
              <div className="space-y-6">
                <div className="bg-white flex justify-center items-center rounded-lg shadow p-4">
                  <div className="overflow-hidden max-h-[600px] flex justify-center w-full">
                    <Manhattan
                      stat={statData}
                      dyn={dynData}
                      ticks={ticks}
                      threshold={logPval}
                      onSNPClick={handleSNPClick}
                      history={history}
                      phenoId={phenoId}
                      selectedCohort={selectedCohort}
                    />
                  </div>
                </div>

                {/* <div className="bg-gray-100 rounded-lg shadow p-4">
                  <h3 className="text-lg font-semibold text-gray-800">Q-Q Plot</h3>
                  <div className="overflow-hidden max-h-[500px]">
                    <QQ data={qq} />
                  </div>
                </div> */}
              </div>

              <div className="bg-gray-100 rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold text-gray-800">Top Results</h3>
                <TopResults data={topResults} onSNPClick={handleSNPClick} />
              </div>
            </div>
          </Tab>

          <Tab eventKey="hudson" title="Compare Ancestries">
            <div className="p-4">
              <div className="bg-gray-100 rounded-lg shadow p-4 mt-4">
                <h3 className="text-lg font-semibold text-gray-800">Ancestry Comparison</h3>
                <Hudson
                  dynTop={dynTop}
                  statTop={statTop}
                  dynBott={dynBott}
                  statBott={statBott}
                  ticksTop={ticksTop}
                  ticksBott={ticksBott}
                  selectedTopAncestry={selectedTopAncestry}
                  selectedBottomAncestry={selectedBottomAncestry}
                  onTopAncestryChange={setSelectedTopAncestry}
                  onBottomAncestryChange={setSelectedBottomAncestry}
                  loadingTop={loadingTop}
                  loadingBottom={loadingBottom}
                  // Use the same cohorts fetched by /findfiles (either gwamaCohorts if gwama, or ['ALL'] if mrmega)
                  availableCohorts={selectedStudy === 'gwama' ? gwamaCohorts : ['ALL']}
                />
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  </div>
);

};

export default GWASPage;
