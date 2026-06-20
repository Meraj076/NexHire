import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Support() {
    return (
        <div className="antialiased min-h-screen flex flex-col relative bg-black text-[#e2e2e2] font-sans">
            <Header />
            <main className="flex-grow z-10 relative pt-32 pb-16 px-4 md:px-16 max-w-[1280px] mx-auto w-full">
                <div className="glass-panel rounded-3xl p-8 md:p-16 border border-[#262626] text-center">
                    <h1 className="text-4xl font-bold text-[#e2e2e2] mb-6">Contact Support</h1>
                    <p className="text-lg text-[#b9cbb8] font-mono max-w-2xl mx-auto mb-10">We are here to help! If you have any questions or are experiencing issues with the platform, please reach out to us.</p>
                    
                    <div className="max-w-md mx-auto space-y-4">
                        <div className="bg-[#0A0A0A] border border-[#262626] p-6 rounded-xl flex items-center justify-between">
                            <div className="text-left">
                                <h3 className="font-bold text-white mb-1">Email Support</h3>
                                <p className="text-sm text-[#b9cbb8]">support@nexhire.ai</p>
                            </div>
                            <span className="material-symbols-outlined text-[#00e472]">mail</span>
                        </div>
                        <div className="bg-[#0A0A0A] border border-[#262626] p-6 rounded-xl flex items-center justify-between">
                            <div className="text-left">
                                <h3 className="font-bold text-white mb-1">Live Chat</h3>
                                <p className="text-sm text-[#b9cbb8]">Available 9 AM - 5 PM EST</p>
                            </div>
                            <span className="material-symbols-outlined text-[#00e472]">chat</span>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
