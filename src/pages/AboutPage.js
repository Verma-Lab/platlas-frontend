import React, { useState, useEffect } from 'react';
import { Mail, Github, Linkedin, Network, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeamMember = ({ name, role, description, imageUrl, socialLinks, isReversed }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
      <div className="md:grid md:grid-cols-2">
        {!isReversed ? (
          <>
            <div className="h-64 md:h-auto">
              <img 
                src={imageUrl || "/api/placeholder/400/320"} 
                alt={name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-indigo-600 font-semibold">
                {role}
              </div>
              <h2 className="mt-2 text-xl font-bold text-gray-900">{name}</h2>
              <p className="mt-4 text-gray-500 leading-relaxed">{description}</p>
              <div className="mt-6 flex space-x-4">
                {socialLinks.email && (
                  <a 
                    href={`mailto:${socialLinks.email}`}
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                    aria-label="Email"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                )}
                {socialLinks.github && (
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
                {socialLinks.linkedin && (
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
          </>
        ) : (
          <>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-indigo-600 font-semibold">
                {role}
              </div>
              <h2 className="mt-2 text-xl font-bold text-gray-900">{name}</h2>
              <p className="mt-4 text-gray-500 leading-relaxed">{description}</p>
              <div className="mt-6 flex space-x-4">
                {socialLinks.email && (
                  <a 
                    href={`mailto:${socialLinks.email}`}
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                    aria-label="Email"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                )}
                {socialLinks.github && (
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
                {socialLinks.linkedin && (
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
            <div className="h-64 md:h-auto">
              <img 
                src={imageUrl || "/api/placeholder/400/320"} 
                alt={name} 
                className="w-full h-full object-cover"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const AboutPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch team members data from landingPageData.json
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
            We're a team of researchers and developers dedicated to advancing genomic research 
            through innovative visualization and analysis tools.
          </p>
        </div>

        {/* Floating Icons */}
        <Share2 
          className="absolute left-[15%] top-[30%] opacity-20 text-white"
          size={24}
          style={{
            animation: 'float 6s ease-in-out infinite'
          }}
        />
        <Network 
          className="absolute right-[20%] bottom-[40%] opacity-20 text-white"
          size={30}
          style={{
            animation: 'float 6s ease-in-out infinite 1s'
          }}
        />

        {/* DNA Animation */}
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
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="space-y-12">
          {teamMembers.map((member, index) => (
            <TeamMember 
              key={member.name}
              name={member.name}
              role={member.role}
              description={member.description}
              imageUrl={member.imageUrl}
              socialLinks={member.socialLinks}
              isReversed={index % 2 !== 0}
            />
          ))}
        </div>
      </div>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
