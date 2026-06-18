import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Privacy() {
    return (
        <div className="antialiased min-h-screen flex flex-col relative bg-black text-[#e2e2e2] font-sans">
            <Header />
            <main className="flex-grow z-10 relative pt-32 pb-16 px-4 md:px-16 max-w-[1280px] mx-auto w-full">
                <div className="glass-panel rounded-3xl p-8 md:p-16 border border-[#262626]">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#e2e2e2] mb-4">Privacy Policy</h1>
                    <p className="text-[#00e472] font-mono mb-12 border-b border-[#262626] pb-8">Last Updated: June 15, 2026</p>
                    
                    <div className="space-y-10 text-[#b9cbb8] font-mono leading-relaxed text-sm md:text-base">
                        
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-[#00e472]">01.</span> Introduction
                            </h2>
                            <p className="mb-4">Welcome to NexHire AI. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.</p>
                            <p>This privacy policy applies to all services provided by NexHire AI, including our AI mock interview platform, resume analysis tools, and associated applications. Please read this privacy policy carefully to understand our practices regarding your personal data.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-[#00e472]">02.</span> Data We Collect About You
                            </h2>
                            <p className="mb-4">Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                            <div className="bg-[#0A0A0A] p-6 rounded-xl border border-[#262626]">
                                <ul className="space-y-4">
                                    <li className="flex gap-4"><span className="material-symbols-outlined text-[#00e472]">badge</span><div><strong className="text-white">Identity Data:</strong> Includes first name, last name, username or similar identifier.</div></li>
                                    <li className="flex gap-4"><span className="material-symbols-outlined text-[#00e472]">mail</span><div><strong className="text-white">Contact Data:</strong> Includes email address and telephone numbers.</div></li>
                                    <li className="flex gap-4"><span className="material-symbols-outlined text-[#00e472]">work</span><div><strong className="text-white">Professional Data:</strong> Includes employment history, education, skills, and resumes uploaded to our platform.</div></li>
                                    <li className="flex gap-4"><span className="material-symbols-outlined text-[#00e472]">devices</span><div><strong className="text-white">Technical Data:</strong> Includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, and operating system.</div></li>
                                    <li className="flex gap-4"><span className="material-symbols-outlined text-[#00e472]">monitoring</span><div><strong className="text-white">Usage Data:</strong> Includes information about how you use our website, mock interviews, and AI analysis tools.</div></li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-[#00e472]">03.</span> How We Use Your Personal Data
                            </h2>
                            <p className="mb-4">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>To register you as a new user and manage your account securely.</li>
                                <li>To provide our core services, including AI-driven interview feedback and resume ATS parsing.</li>
                                <li>To manage our relationship with you, including notifying you about changes to our terms or privacy policy.</li>
                                <li>To administer and protect our business and this website (including troubleshooting, data analysis, testing, system maintenance, and hosting of data).</li>
                                <li>To use data analytics to improve our website, AI models, marketing, customer relationships, and experiences.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-[#00e472]">04.</span> AI Processing & Third-Party Sharing
                            </h2>
                            <p className="mb-4">Our services rely on advanced Artificial Intelligence models. When you interact with our mock interviews or upload a resume:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                                <li>Your input data is securely transmitted to our AI partners (e.g., Google Gemini) for processing.</li>
                                <li>We <strong className="text-white">do not</strong> allow our AI partners to use your personal data to train their foundational models without your explicit consent.</li>
                                <li>We <strong className="text-white">do not</strong> sell your personal data to third parties for marketing purposes under any circumstances.</li>
                            </ul>
                            <p>We may share your data with trusted service providers acting as processors who provide essential IT and system administration services.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-[#00e472]">05.</span> Data Security
                            </h2>
                            <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. All traffic is encrypted using industry-standard SSL/TLS protocols. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a strict duty of confidentiality.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-[#00e472]">06.</span> Data Retention & Account Deletion
                            </h2>
                            <p>We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting, or reporting requirements. You have full control over your data. You can request the complete deletion of your account and all associated history at any time through your account settings dashboard.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-[#00e472]">07.</span> Your Legal Rights
                            </h2>
                            <p className="mb-4">Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border border-[#262626] p-4 rounded-lg bg-[#0A0A0A] hover:border-[#00e472]/50 transition-colors">Request access to your personal data</div>
                                <div className="border border-[#262626] p-4 rounded-lg bg-[#0A0A0A] hover:border-[#00e472]/50 transition-colors">Request correction of your personal data</div>
                                <div className="border border-[#262626] p-4 rounded-lg bg-[#0A0A0A] hover:border-[#00e472]/50 transition-colors">Request erasure of your personal data</div>
                                <div className="border border-[#262626] p-4 rounded-lg bg-[#0A0A0A] hover:border-[#00e472]/50 transition-colors">Object to processing of your personal data</div>
                                <div className="border border-[#262626] p-4 rounded-lg bg-[#0A0A0A] hover:border-[#00e472]/50 transition-colors">Request restriction of processing</div>
                                <div className="border border-[#262626] p-4 rounded-lg bg-[#0A0A0A] hover:border-[#00e472]/50 transition-colors">Right to withdraw consent</div>
                            </div>
                        </section>

                        <section className="pt-8 border-t border-[#262626]">
                            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                            <p>If you have any questions about this privacy policy or our privacy practices, please contact our Data Protection Officer at <a href="mailto:privacy@nexhire.ai" className="text-[#00e472] hover:underline font-bold">privacy@nexhire.ai</a>.</p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
