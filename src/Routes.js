import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import GWASPage from './pages/GWASPage';
import PheWASPage from './pages/PhewasPage';
import Footer from './components/Footer';
import AboutPage from './pages/AboutPage';
import DocumentationPage from './components/DocumentationPage';
import ContactPage from './components/ContactPage';
import LandingPage from './pages/LandingPage';
import AuthPage from './components/AuthPage'; // Add this import
import ProtectedRoute from './components/ProtectedRoute'; // Add this import

export const RoutesPage = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected Routes */}
            <Route path="/platlas" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path='/gwas/:phenoId' element={
              <ProtectedRoute>
                <GWASPage />
              </ProtectedRoute>
            } />
            <Route path="/phewas" element={
              <ProtectedRoute>
                <PheWASPage />
              </ProtectedRoute>
            } />
            <Route path="/about" element={
              <ProtectedRoute>
                <AboutPage />
              </ProtectedRoute>
            } />
            <Route path="/documentation" element={
              <ProtectedRoute>
                <DocumentationPage />
              </ProtectedRoute>
            } />
            <Route path="/contact" element={
              <ProtectedRoute>
                <ContactPage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};