import React from 'react';
import { BookOpen, FileText, Award, Lightbulb, ArrowRight, Building2, Flask, Target } from 'lucide-react';

const ResearchSection = () => {
  const researchHighlights = [
    {
      icon: BookOpen,
      title: "Research Overview",
      description: "A comprehensive multi-ancestry genome-wide association study platform analyzing genetic variations across diverse populations.",
      points: [
        "Integration of multiple cohorts including EUR, EAS, AFR, and AMR populations",
        "Novel statistical approaches for cross-ancestry analysis",
        "Advanced visualization tools for genetic associations"
      ]
    },
    {
      icon: Target,
      title: "Key Innovations",
      description: "Cutting-edge methodologies and tools developed for enhanced genetic analysis.",
      points: [
        "Dynamic Manhattan plots with interactive features",
        "Cross-ancestry comparison through Hudson plots",
        "Integrated PheWAS visualization",
        "Real-time genetic association exploration"
      ]
    },
    {
      icon: Building2,
      title: "Infrastructure",
      description: "Robust computational framework supporting large-scale genomic analysis.",
      points: [
        "Scalable data processing pipeline",
        "Efficient storage and retrieval system",
        "Real-time analysis capabilities",
        "Interactive visualization engine"
      ]
    }
  ];

  const publicationInfo = {
    title: "Genome-Wide Assessment of Pleiotropy Across >1000 Traits from Diverse Biobanks",
    journal: "Medrxiv",
    year: "2025",
    doi: "https://www.medrxiv.org/content/10.1101/2025.04.18.25326074v1"
  };

  // Truncated abstract text
  const truncatedAbstract = "Large-scale genetic association studies have identified thousands of trait-associated risk loci, establishing the polygenic basis for common complex traits and diseases. Although prior studies suggest that many trait-associated loci are pleiotropic, the extent to which this pleiotropy reflects shared causal variants or confounding by linkage disequilibrium remains poorly characterized...";

  // Function to handle opening the paper
  const handleOpenPaper = () => {
    window.open(publicationInfo.doi, '_blank');
  };

  return (  
    <div className="space-y-20 py-16">
      {/* Publication Section */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
          <div className="flex items-center gap-4 mb-6">
            <FileText className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Publication Details</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">{publicationInfo.title}</h3>
              <div className="space-y-2">
                <p><span className="opacity-75">Journal:</span> {publicationInfo.journal}</p>
                <p><span className="opacity-75">Year:</span> {publicationInfo.year}</p>
                <p><span className="opacity-75">DOI:</span> <a href={publicationInfo.doi} target="_blank" rel="noopener noreferrer" className="underline text-white hover:text-blue-100">{publicationInfo.doi}</a></p>
              </div>
              <button 
                onClick={handleOpenPaper} 
                className="mt-4 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
              >
                Read Full Paper
              </button>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Abstract Highlight</h4>
              <p className="text-sm opacity-90 leading-relaxed">
                {truncatedAbstract}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchSection;