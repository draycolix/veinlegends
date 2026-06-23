'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Tokenomics from '@/components/Tokenomics';
import Gameplay from '@/components/Gameplay';
import Roadmap from '@/components/Roadmap';
import Characters from '@/components/Characters';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

// Lazy load heavy components
const Stats = dynamic(() => import('@/components/Stats'), { ssr: false });

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-dark-900 via-dark-900 to-dark-800 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

      <Navbar />

      <main className="relative z-10">
        <Hero />
        <Stats />
        <Gameplay />
        <Characters />
        <Tokenomics />
        <Roadmap />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
