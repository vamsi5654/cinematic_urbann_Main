import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Topbar } from './components/Topbar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { EventPopup } from './components/EventPopup';
import { WhatsAppButton } from './components/WhatsAppButton';
import Home from './pages/Home';
import GalleryVideo from './pages/GalleryVideo';
import ProjectDetail from './pages/ProjectDetail';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminVideo from './pages/AdminVideo';
import './styles/globals.css';

export default function App() {
  return (
    <Router>
      <div className="app">
        <Topbar />
        <Header />
        <EventPopup />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<GalleryVideo />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminVideo />} />
          </Routes>
        </main>
        
        <Footer />
        
        {/* WhatsApp Floating Button - Shows on all pages */}
        <WhatsAppButton />
      </div>
    </Router>
  );
}