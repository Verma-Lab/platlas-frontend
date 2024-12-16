import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import GWASPage from './pages/GWASPage';
import PheWASPage from './pages/PhewasPage';
import Footer from './components/Footer';
import AboutPage from './pages/AboutPage';
import DocumentationPage from './components/DocumentationPage';
import ContactPage from './components/ContactPage';

export const RoutesPage = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow">
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/gwas/:phenoId' element={<GWASPage />} />
            <Route path="/phewas" element={<PheWASPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/documentation" element={<DocumentationPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};