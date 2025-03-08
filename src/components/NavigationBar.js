import React from 'react';
import { Search, Table, Users, FileText, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavigationBar = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    console.log('Attempting to scroll to:', sectionId);
    
    // First attempt with exact ID
    let element = document.getElementById(sectionId);
    
    // If not found, try with spaces removed (for IDs like "Association Results")
    if (!element) {
      element = document.getElementById(sectionId.replace(/\s/g, ''));
      console.log('Trying without spaces:', sectionId.replace(/\s/g, ''));
    }
    
    // If still not found, try looking for an element with this text in its heading
    if (!element) {
      const headings = document.querySelectorAll('h2, h3, h4');
      for (const heading of headings) {
        if (heading.textContent.trim().includes(sectionId)) {
          element = heading.closest('div[id]') || heading.parentElement;
          console.log('Found by heading text:', heading.textContent.trim());
          break;
        }
      }
    }
    
    if (element) {
      console.log('Found element:', element);
      const yOffset = -100; // Adjust this value as needed for proper scrolling position
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    } else {
      console.error('Could not find element with ID:', sectionId);
    }
  };

  const handleClick = (text) => {
    if (text === 'About') {
      navigate('/about');
      return;
    }
    if (text === 'HomoSapieus') {
      navigate('/landingPageHomo');
      return;
    }
    if (text === 'Downloads') {
      navigate('/downloads');
      return;
    }

    // Preserve the original text for searching
    console.log('Clicking:', text);
    scrollToSection(text);
  };

  const navItems = [
    { icon: Users, text: 'About' },
    { icon: Table, text: 'Association Results' },
    { icon: FileText, text: 'Paper' },
    { icon: FileText, text: 'Downloads' },
    // { icon: Brain, text: 'HomoSapieus', secondaryText: '(Genomics LLM)' }
  ];

  return (
    <nav className="flex items-center space-x-4">
      {navItems.map(({ icon: Icon, text, secondaryText }) => (
        <button
          key={text}
          onClick={() => handleClick(text)}
          className="flex items-center space-x-2 text-white/90 hover:text-white 
                   transition-colors duration-200 px-3 py-2 focus:outline-none 
                   focus:ring-2 focus:ring-white/50 rounded-lg"
        >
          <Icon className="w-4 h-4" />
          <span className="text-sm font-medium cursor-pointer">
            {text}
            {secondaryText && <span className="text-white ml-1">{secondaryText}</span>}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default NavigationBar;