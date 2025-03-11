import React, { useEffect } from 'react';
import { Search, Table, Users, FileText, Brain, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavigationBar = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    console.log('Attempting to scroll to:', sectionId);
    
    // First attempt with exact ID
    let element = document.getElementById(sectionId);
    
    // If not found, try with spaces removed (for IDs like "Association Results")
    if (!element) {
      const noSpacesId = sectionId.replace(/\s/g, '');
      element = document.getElementById(noSpacesId);
      console.log('Trying without spaces:', noSpacesId);
    }
    
    // If still not found, try looking for an element with data-section attribute
    if (!element) {
      element = document.querySelector(`[data-section="${sectionId}"]`);
      console.log('Trying with data-section attribute:', sectionId);
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
      // Fallback - try to find any div containing the section ID text
      const allDivs = document.querySelectorAll('div');
      for (const div of allDivs) {
        if (div.textContent.includes(sectionId) && div.id) {
          const y = div.getBoundingClientRect().top + window.pageYOffset - 100;
          window.scrollTo({
            top: y,
            behavior: 'smooth'
          });
          console.log('Fallback: found div containing text:', sectionId);
          return;
        }
      }
      
      console.error('Could not find element with ID:', sectionId);
    }
  };

  // Add this effect to handle hash URLs for direct section navigation
  useEffect(() => {
    if (window.location.hash) {
      const sectionId = window.location.hash.substring(1); // Remove the # character
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 500); // Small delay to ensure DOM is fully loaded
    }
  }, []);

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

    // For section navigation within the page
    console.log('Clicking:', text);
    scrollToSection(text);
  };

  const navItems = [
    { icon: Users, text: 'About' },
    { icon: Table, text: 'Association Results' },
    { icon: FileText, text: 'paper' },
    { icon: Download, text: 'Downloads' },
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