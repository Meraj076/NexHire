import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer({ compact = false }) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`bg-[#0c0f0f]/80 w-full ${compact ? 'py-6' : 'py-16'} border-t border-white/10 z-10 relative`}>
            <div className={`flex flex-col md:flex-row justify-between items-center px-4 md:px-16 ${compact ? 'gap-4 md:gap-2' : 'gap-8 md:gap-6'} max-w-[1280px] mx-auto`}>
                
                {/* Brand Name */}
                {!compact && (
                    <Link to="/" className="text-2xl font-bold text-[#e2e2e2] mb-2 md:mb-0 hover:text-[#00e472] transition-colors">
                        NexHire
                    </Link>
                )}
                
                {/* Footer Links */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                    <Link to="/privacy" className="text-[#bab8b7] hover:text-[#f0ffed] transition-colors font-mono text-[10px] md:text-xs">
                        Privacy Policy
                    </Link>
                    <Link to="/terms" className="text-[#bab8b7] hover:text-[#f0ffed] transition-colors font-mono text-[10px] md:text-xs">
                        Terms of Service
                    </Link>
                    <Link to="/api-docs" className="text-[#bab8b7] hover:text-[#f0ffed] transition-colors font-mono text-[10px] md:text-xs">
                        API Docs
                    </Link>
                    <Link to="/support" className="text-[#bab8b7] hover:text-[#f0ffed] transition-colors font-mono text-[10px] md:text-xs">
                        Contact Support
                    </Link>
                </div>
                
                {/* Copyright Text */}
                <div className={`text-[#00e472] font-mono text-[10px] md:text-xs text-center`}>
                    © {currentYear} NexHire AI{compact ? '.' : ' Career Intelligence. All rights reserved.'}
                </div>
                
            </div>
        </footer>
    );
}