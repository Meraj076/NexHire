import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Terms() {
    return (
        <div className="antialiased min-h-screen flex flex-col relative bg-black text-[#e2e2e2] font-sans">
            <Header />
            <main className="flex-grow z-10 relative pt-32 pb-16 px-4 md:px-16 max-w-[1280px] mx-auto w-full">
                <div className="glass-panel rounded-3xl p-8 md:p-16 border border-[#262626]">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#e2e2e2] mb-4">Terms of Service</h1>
                    <p className="text-[#00e472] font-mono mb-12 border-b border-[#262626] pb-8">Last Updated: June 15, 2026</p>
                    
                    <div className="space-y-10 text-[#b9cbb8] font-mono leading-relaxed text-sm md:text-base">
                        
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-[#00e472]">01.</span> Agreement to Terms
                            </h2>
                            <p>These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and NexHire AI ("we," "us" or "our"), concerning your access to and use of the NexHire AI website as well as any other media form, media channel, mobile website, or mobile application related, linked, or otherwise connected thereto. You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms of Service. If you do not agree with all of these Terms of Service, then you are expressly prohibited from using the Site and you must discontinue use immediately.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-[#00e472]">02.</span> Intellectual Property Rights
                            </h2>
                            <p>Unless otherwise indicated, the Site and Services are our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights and unfair competition laws of the United States, foreign jurisdictions, and international conventions.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-[#00e472]">03.</span> User Representations
                            </h2>
                            <p className="mb-4">By using the Site, you represent and warrant that:</p>
                            <ul className="list-disc list-inside space-y-3 ml-4 bg-[#0A0A0A] p-6 rounded-xl border border-[#262626]">
                                <li>All registration information you submit will be true, accurate, current, and complete.</li>
                                <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                                <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                                <li>You will not access the Site through automated or non-human means, whether through a bot, script, or otherwise, without our explicit API access.</li>
                                <li>You will not use the Site for any illegal or unauthorized purpose.</li>
                                <li>Your use of the Site will not violate any applicable law or regulation.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-[#00e472]">04.</span> AI Services and Accuracy Disclaimer
                            </h2>
                            <p className="p-4 border-l-4 border-[#00e472] bg-[#00e472]/5 rounded-r-lg">
                                NexHire AI utilizes advanced artificial intelligence models to simulate interviews, parse resumes, and provide feedback. While we strive for high accuracy, AI-generated feedback and scoring are provided for <strong>educational and preparatory purposes only</strong>. We do not guarantee employment, interview success, or the absolute correctness of any AI-generated feedback. You are solely responsible for how you apply the insights gained from our platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-[#00e472]">05.</span> User Data and Content License
                            </h2>
                            <p>You retain full ownership of any resumes, code snippets, textual answers, or interview recordings you submit to the platform. By submitting content, you grant us a limited, worldwide, non-exclusive license to use, process, and display this content strictly for the purpose of providing the Services to you. We do not claim permanent ownership over your personal professional data, and you may delete your data at any time.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-[#00e472]">06.</span> Subscription and Payments
                            </h2>
                            <p>Certain features of the Site may require a paid subscription. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site. We reserve the right to change prices at any time. All payments shall be in U.S. dollars unless otherwise specified. Subscription fees are non-refundable except as required by law. If you subscribe to a recurring plan, you authorize us to charge your payment method automatically on a recurring basis.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-[#00e472]">07.</span> Prohibited Activities
                            </h2>
                            <p className="mb-4">You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us. Prohibited activities include, but are not limited to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Systematically retrieving data or other content from the Site to create or compile a collection, compilation, database, or directory without written permission from us.</li>
                                <li>Tricking, defrauding, or misleading us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
                                <li>Circumventing, disabling, or otherwise interfering with security-related features of the Site.</li>
                                <li>Attempting to reverse engineer or access the underlying AI models improperly.</li>
                                <li>Using the Site to compete with us or otherwise using the Site and/or the Content for any revenue-generating endeavor or commercial enterprise.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-[#00e472]">08.</span> Limitation of Liability
                            </h2>
                            <p>IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SITE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
                        </section>

                        <section className="pt-8 border-t border-[#262626]">
                            <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
                            <p>To resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact our legal team at <a href="mailto:legal@nexhire.ai" className="text-[#00e472] hover:underline font-bold">legal@nexhire.ai</a>.</p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
