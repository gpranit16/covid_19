import React from 'react';
import ThreeBg from './ThreeBg';
import { Shield, ChevronRight, Terminal, Database, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = ({ onEnter }) => {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050505] flex items-center justify-center font-heading">
      {/* 3D Background */}
      <ThreeBg />

      {/* Grid Scanline Overlay for retro-cyber Vibe */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none z-10" />

      {/* Main Terminal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-20 w-[90%] max-w-xl bg-[#0E0E0E]/90 border-2 border-brand-border p-8 rounded-brutalist shadow-[6px_6px_0px_0px_#2A2A2A] backdrop-blur-md"
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-brand-primary animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-brand-primary uppercase font-bold">
              SYSINIT // SECURE LINK
            </span>
          </div>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-danger"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-brand-secondary"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-brand-success"></span>
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-4 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold font-condensed tracking-tight text-white leading-none uppercase">
            COVID-19 INDIA <br />
            <span className="text-brand-primary">INTELLIGENCE PLATFORM</span>
          </h1>
          <p className="text-xs text-brand-muted font-mono leading-relaxed uppercase">
            EPIDEMIOLOGICAL SURVEILLANCE & MATHEMATICAL SIR SIMULATION ENGINE.
          </p>
        </div>

        {/* Console System Stats */}
        <div className="bg-brand-bg p-4 rounded-lg border border-brand-border mt-6 space-y-2 font-mono text-[10px] text-brand-muted text-left">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 uppercase">
              <Terminal className="w-3.5 h-3.5 text-brand-primary" />
              SYSTEM CORE
            </span>
            <span className="text-white">STITCH-LOG ENGINE 1.0b</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 uppercase">
              <Database className="w-3.5 h-3.5 text-brand-secondary" />
              DATABASE ARCHIVE
            </span>
            <span className="text-white">37,034 HISTORICAL RECORDS</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 uppercase">
              <Activity className="w-3.5 h-3.5 text-brand-success" />
              STATUS
            </span>
            <span className="text-brand-success font-bold">READY TO INITIALIZE</span>
          </div>
        </div>

        {/* Enter Button */}
        <div className="mt-8 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onEnter}
            className="group flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-lg border-2 border-black bg-brand-primary text-black font-extrabold text-sm uppercase tracking-wide transition-brutal shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            <span>INITIALIZE COMMAND CONSOLE</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
