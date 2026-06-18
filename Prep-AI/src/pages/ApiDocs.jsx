import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ApiDocs() {
    return (
        <div className="antialiased min-h-screen flex flex-col relative bg-black text-[#e2e2e2] font-sans">
            <Header />
            <main className="flex-grow z-10 relative pt-32 pb-16 px-4 md:px-16 max-w-[1280px] mx-auto w-full">
                <div className="glass-panel rounded-3xl p-8 md:p-16 border border-[#262626]">
                    <h1 className="text-4xl font-bold text-[#e2e2e2] mb-8">API Documentation</h1>
                    <div className="space-y-6 text-[#b9cbb8] font-mono leading-relaxed">
                        <p>Welcome to the NexHire API Documentation. Here you will find everything you need to integrate our AI-powered interview and resume analysis features into your own applications.</p>
                        
                        <h2 className="text-2xl font-bold text-[#00e472] mt-8 mb-4">Authentication</h2>
                        <p>All API requests require an authentication token passed in the Authorization header as a Bearer token. You can generate tokens from your developer dashboard.</p>
                        
                        <pre className="bg-[#0A0A0A] p-4 rounded-lg border border-[#262626] overflow-x-auto text-[#00e472]">
                            <code>Authorization: Bearer YOUR_API_KEY</code>
                        </pre>

                        <h2 className="text-2xl font-bold text-[#00e472] mt-8 mb-4">Endpoints</h2>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong className="text-white">POST /api/v1/interviews/start</strong> - Start a new AI mock interview session.</li>
                            <li><strong className="text-white">POST /api/v1/interviews/next</strong> - Submit an answer and get the next question.</li>
                            <li><strong className="text-white">POST /api/v1/resumes/upload</strong> - Upload a resume for ATS analysis.</li>
                        </ul>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
