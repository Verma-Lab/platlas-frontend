import React, { useState, useEffect, useRef } from 'react';
import { Mail, Github, Linkedin, Network, Share2, Database, ChartBar, Dna } from 'lucide-react';

// TeamMember Component (Updated to match landing page style)
const TeamMember = ({ name, role, description, imageUrl, socialLinks }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg text-center flex-none w-72">
      <img
        src={imageUrl || "/api/placeholder/400/320"}
        alt={name}
        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
      />
      <h3 className="text-xl font-semibold mb-1">{name}</h3>
      <p className="text-blue-600 font-medium mb-2">{role}</p>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="flex justify-center space-x-4">
        {socialLinks?.email && (
          <a 
            href={`mailto:${socialLinks.email}`}
            className="text-gray-600 hover:text-indigo-600 transition-colors"
            aria-label="Email"
          >
            <Mail className="h-5 w-5" />
          </a>
        )}
        {socialLinks?.github && (
          <a 
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-indigo-600 transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
        )}
        {socialLinks?.linkedin && (
          <a 
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-indigo-600 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        )}
      </div>
    </div>
  );
};

// Animated DNA Component (kept from original)
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

// Main About Page Component
const AboutPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const teamScrollRef = useRef(null);

  useEffect(() => {
    fetch('/landingPageData.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch landing page data.');
        }
        return response.json();
      })
      .then((jsonData) => {
        setTeamMembers(jsonData.teamMembers);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching team members:', error);
        setError(true);
        setLoading(false);
      });
  }, []);

  // Auto-scroll effect for team members
  useEffect(() => {
    if (!teamMembers.length) return;

    const scrollContainer = teamScrollRef.current;
    if (!scrollContainer) return;

    const scrollSpeed = 1; // pixels per interval
    const intervalTime = 20; // milliseconds

    const scrollInterval = setInterval(() => {
      if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += scrollSpeed;
      }
    }, intervalTime);

    return () => clearInterval(scrollInterval);
  }, [teamMembers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-700">Loading team members...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-500">Failed to load team members. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div 
        className="w-full relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #2563EB 100%)',
          borderRadius: '0 0 2rem 2rem'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4">About PLATLAS</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Discover, explore, and analyze genetic associations across diverse populations
          </p>
        </div>

        {/* Floating Icons */}
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

        <AnimatedDNA />
      </div>

      {/* Description Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 -mt-24 relative z-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What is PLATLAS?</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              <strong className="text-indigo-600">PL</strong>eiotropic <strong className="text-indigo-600">ATLAS</strong> (PLATLAS) is a comprehensive resource that integrates genome-wide association meta-analyses of up to 1,1678 traits and diseases from large, diverse biobanks.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[
                'Million Veteran Program (MVP)',
                'UK Biobank (UKB)',
                'FinnGen',
                'Biobank Japan (BBJ)',
                'Tohoku Medical Megabank (ToMMo)',
                'Korean Genome and Epidemiology Study (KoGES)'
              ].map((biobank) => (
                <div key={biobank} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Database className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{biobank}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section (Updated) */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-lg text-gray-600">World-class experts in genomics and data science</p>
        </div>
        
        <div className="relative">
          <div className="overflow-x-auto pb-4 hide-scrollbar" ref={teamScrollRef}>
            <div className="flex space-x-6">
              {teamMembers.map((member, index) => (
                <TeamMember 
                  key={member.name}
                  {...member}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;