import React from 'react';
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
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Principal Investigator",
      description: "Leading expert in statistical genetics with over 15 years of experience in GWAS analysis.",
      imageUrl: "/api/placeholder/400/320"
    },
    {
      name: "Dr. Michael Chen",
      role: "Lead Bioinformatician",
      description: "Specializes in developing computational tools for genomic data analysis.",
      imageUrl: "/api/placeholder/400/320"
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Statistical Geneticist",
      description: "Expert in population genetics and statistical methodology.",
      imageUrl: "/api/placeholder/400/320"
    },
    {
      name: "Dr. David Kim",
      role: "Data Scientist",
      description: "Specialized in machine learning applications in genomics.",
      imageUrl: "/api/placeholder/400/320"
    },
    {
      name: "Dr. Lisa Wang",
      role: "Population Geneticist",
      description: "Expert in multi-ethnic genetic studies and diversity research.",
      imageUrl: "/api/placeholder/400/320"
    },
    {
      name: "Dr. James Martinez",
      role: "Computational Biologist",
      description: "Focuses on algorithm development for genomic analysis.",
      imageUrl: "/api/placeholder/400/320"
    },
    {
      name: "Dr. Anna Kowalski",
      role: "Research Scientist",
      description: "Specializes in functional genomics and biomarker discovery.",
      imageUrl: "/api/placeholder/400/320"
    },
    {
      name: "Dr. Robert Thompson",
      role: "Biostatistician",
      description: "Expert in statistical methods for large-scale genetic studies.",
      imageUrl: "/api/placeholder/400/320"
    },
    {
      name: "Dr. Maria Garcia",
      role: "Software Engineer",
      description: "Leads the development of visualization tools and web interfaces.",
      imageUrl: "/api/placeholder/400/320"
    },
    {
      name: "Dr. John Smith",
      role: "Research Coordinator",
      description: "Manages research projects and international collaborations.",
      imageUrl: "/api/placeholder/400/320"
    }
  ].map(member => ({
    ...member,
    socialLinks: {
      email: `${member.name.toLowerCase().replace(' ', '.')}@example.com`,
      github: `https://github.com/${member.name.toLowerCase().replace(' ', '')}`,
      linkedin: `https://linkedin.com/in/${member.name.toLowerCase().replace(' ', '')}`
    }
  }));

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
              {...member}
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