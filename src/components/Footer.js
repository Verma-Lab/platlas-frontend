import React from 'react';
import { Link } from 'react-router-dom';
import { Share2, Network, Mail, Github, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto">
      {/* Gradient Background */}
      <div 
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #2563EB 100%)',
        }}
      >
        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Network className="h-6 w-6" />
                PLATLAS
              </h2>
              <p className="text-blue-100">
                Advancing genomic research through cutting-edge data visualization and analysis tools.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-blue-100 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-blue-100 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/documentation" className="text-blue-100 hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                <Link to="/contact" className="text-blue-100 hover:text-white transition-colors flex items-center gap-1">
  Contact
  <ExternalLink className="h-4 w-4" />
</Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Connect With Us</h3>
              <div className="space-y-2">
    
                <a 
                  href="https://github.com/platlas" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-100 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-blue-400/30">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-blue-100 text-sm">
                © {currentYear} PLATLAS. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link to="/privacy" className="text-blue-100 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-blue-100 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
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
      </div>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </footer>
  );
};

export default Footer;