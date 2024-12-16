import React, { useState } from 'react';
import { File, Code, Database, ChevronRight, ExternalLink, BookOpen, Search, Network, Share2 } from 'lucide-react';

const DocumentationPage = () => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: BookOpen,
      content: [
        {
          title: 'Introduction',
          description: 'PLATLAS is a comprehensive platform for analyzing and visualizing genome-wide association studies across multiple ancestries.',
          subsections: [
            'Platform Overview',
            'Key Features',
            'System Requirements'
          ]
        },
        {
          title: 'Quick Start Guide',
          description: 'Learn how to get started with PLATLAS and perform your first analysis.',
          subsections: [
            'Basic Navigation',
            'Data Upload',
            'Visualization Tools'
          ]
        }
      ]
    },
    {
      id: 'data-formats',
      title: 'Data Formats',
      icon: Database,
      content: [
        {
          title: 'Input Data Requirements',
          description: 'Specifications for GWAS summary statistics and other input data formats.',
          subsections: [
            'Summary Statistics Format',
            'Phenotype Data Format',
            'Cohort Information'
          ]
        }
      ]
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      icon: Code,
      content: [
        {
          title: 'REST API Documentation',
          description: 'Complete reference for the PLATLAS REST API endpoints.',
          subsections: [
            'Authentication',
            'Endpoints',
            'Rate Limits'
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div 
        className="w-full relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #2563EB 100%)',
          borderRadius: '0 0 2rem 2rem'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4">Documentation</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Learn how to use PLATLAS for your genetic research and analysis.
          </p>
        </div>

        {/* Animated elements */}
        <Share2 
          className="absolute left-[15%] top-[30%] opacity-20 text-white"
          size={24}
          style={{ animation: 'float 6s ease-in-out infinite' }}
        />
        <Network 
          className="absolute right-[20%] bottom-[40%] opacity-20 text-white"
          size={30}
          style={{ animation: 'float 6s ease-in-out infinite 1s' }}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-xl shadow-lg p-6">
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <section.icon className="h-5 w-5" />
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {sections
              .find(section => section.id === activeSection)
              ?.content.map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 mb-6">{item.description}</p>
                  <div className="space-y-4">
                    {item.subsections.map((subsection, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer group"
                      >
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                        <span>{subsection}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
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

export default DocumentationPage;