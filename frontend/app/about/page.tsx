"use client";

import { Cpu, Database, Shield, Zap, Heart, Flame, Salad, Moon, ArrowRight, Activity } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#f0effb] text-slate-900 font-sans selection:bg-purple-200 selection:text-purple-900 pb-20">
            {/* Enhanced Pastel Background Gradients */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[100px] -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-pink-200/40 rounded-full blur-[100px] translate-y-1/2"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 pt-32">
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
                        <Shield className="w-4 h-4 text-purple-600" />
                        <span className="text-[11px] font-black text-purple-800 tracking-widest uppercase">
                            Technology & Governance
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600">CardioPredict AI</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                        Our mission is to democratize advanced cardiovascular diagnostics through accessible, high-precision artificial intelligence.
                    </p>
                </div>

                {/* Core Pillars */}
                <section className="mb-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                title: "Neural Architecture",
                                desc: "Proprietary ensemble models optimized for high-dimensional clinical data.",
                                icon: <Cpu className="w-6 h-6 text-purple-600" />,
                                bg: "bg-purple-50"
                            },
                            {
                                title: "Data Integrity",
                                desc: "Verified on 70,000+ clinical records for maximum predictive reliability.",
                                icon: <Database className="w-6 h-6 text-indigo-600" />,
                                bg: "bg-indigo-50"
                            },
                            {
                                title: "Ethical AI",
                                desc: "Designed with bias mitigation and interpretable confidence scoring.",
                                icon: <Shield className="w-6 h-6 text-pink-600" />,
                                bg: "bg-pink-50"
                            },
                            {
                                title: "Rapid Inference",
                                desc: "Blazing fast cloud-based processing for immediate health insights.",
                                icon: <Zap className="w-6 h-6 text-amber-600" />,
                                bg: "bg-amber-50"
                            }
                        ].map((pillar, i) => (
                            <div key={i} className="bg-white/70 backdrop-blur-xl p-8 rounded-[40px] border-2 border-purple-100 shadow-xl shadow-purple-100/10 group hover:-translate-y-2 transition-all">
                                <div className={`w-14 h-14 ${pillar.bg} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                                    {pillar.icon}
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{pillar.title}</h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                    {pillar.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Workflow Section */}
                <section className="mb-20">
                    <div className="bg-white/90 backdrop-blur-3xl rounded-[60px] p-10 md:p-20 shadow-2xl border-2 border-purple-100 relative overflow-hidden ring-1 ring-white/50">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

                        <div className="relative z-10 text-center mb-20">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                                Methodological <span className="text-purple-600">Core</span>
                            </h2>
                            <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
                                Our diagnostic pipeline integrates sophisticated preprocessing with elite machine learning algorithms.
                            </p>
                        </div>

                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12">
                            {[
                                {
                                    step: "01",
                                    title: "Clinical Input",
                                    desc: "Aggregate biometric data across 12 critical cardiovascular vectors.",
                                    gradient: "from-purple-500 to-indigo-500"
                                },
                                {
                                    step: "02",
                                    title: "Synthesis",
                                    desc: "Dynamic scaling and normalization to prepare data for neural analysis.",
                                    gradient: "from-indigo-500 to-blue-500"
                                },
                                {
                                    step: "03",
                                    title: "Processing",
                                    desc: "Ensemble voting across Gradient Boosting and Forest architectures.",
                                    gradient: "from-blue-500 to-pink-500"
                                },
                                {
                                    step: "04",
                                    title: "Analytics",
                                    desc: "Generate probability density and granular risk stratification reports.",
                                    gradient: "from-pink-500 to-rose-500"
                                },
                            ].map((item, i) => (
                                <div key={i} className="group">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center text-xl font-black mb-8 shadow-xl shadow-purple-200 group-hover:scale-110 transition-transform`}>
                                        {item.step}
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-purple-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed group-hover:text-slate-700 transition-colors">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Bio-Dynamic Blueprint Section */}
                <section className="mb-40 relative px-4">
                    {/* Background Creative Elements */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] md:text-[20vw] font-black text-slate-200/40 text-outline select-none leading-none">
                            VITALITY
                        </div>
                        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-200/40 rounded-full blur-[100px] animate-blob"></div>
                        <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-200/40 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
                    </div>

                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                            <div className="max-w-2xl">
                                <span className="text-purple-600 font-black text-xs uppercase tracking-[0.4em] mb-4 block">Clinical Optimization</span>
                                <h2 className="text-4xl sm:text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.85]">
                                    Bio-Dynamic <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Blueprint</span>
                                </h2>
                            </div>
                            <p className="text-slate-500 font-medium text-lg max-w-sm border-l-4 border-purple-200 pl-6 leading-relaxed">
                                A curated synthesis of preventative health vectors designed to extend your biological prime.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 perspective-1000">
                            {/* Column 1: Nutrition (Tall & Tilted) */}
                            <div className="md:col-span-4 group">
                                <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[60px] border-2 border-purple-100 shadow-2xl shadow-purple-100/20 transform group-hover:rotate-y-12 transition-all duration-700 h-full relative overflow-hidden">
                                    <div className="absolute -top-10 -right-10 text-[120px] font-black text-slate-50 select-none">01</div>
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 bg-emerald-100 rounded-[28px] flex items-center justify-center mb-10 shadow-inner">
                                            <Salad className="w-8 h-8 text-emerald-600" />
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Heart-Smart Nutrition</h3>
                                        <ul className="space-y-8">
                                            {[
                                                { label: "SALT MANAGEMENT", val: "LESS SODIUM", desc: "Lowering salt intake helps keep your blood pressure in a healthy range." },
                                                { label: "HEALTHY FATS", val: "OMEGA-3 RICH", desc: "Eating fish, nuts, and seeds supports heart strength and blood flow." },
                                                { label: "FIBER INTAKE", val: "HIGH FIBER", desc: "Oats, beans, and greens help manage cholesterol and blood sugar levels." }
                                            ].map((item, idx) => (
                                                <li key={idx}>
                                                    <div className="flex justify-between items-end mb-2">
                                                        <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{item.label}</span>
                                                        <span className="text-xs font-black text-purple-600 px-2 py-1 bg-purple-50 rounded-lg">{item.val}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {/* Abstract Line Decoration */}
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-transparent opacity-30"></div>
                                </div>
                            </div>

                            {/* Column 2: Recovery (The "Hub" Card) */}
                            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[60px] p-12 text-white relative overflow-hidden group shadow-2xl shadow-indigo-200">
                                    <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                                        <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center relative animate-slow-spin">
                                            <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full"></div>
                                            <Flame className="w-20 h-20 text-white animate-pulse" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-6">Daily Action Plan</div>
                                            <h3 className="text-4xl font-black mb-4 tracking-tight">Active Living</h3>
                                            <p className="text-indigo-100 text-lg font-medium leading-relaxed opacity-90 max-w-md">
                                                Moving your body daily helps strengthen your heart muscle and improves overall blood circulation.
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowRight className="absolute top-10 right-10 w-12 h-12 text-white/10 group-hover:scale-125 transition-transform" />
                                </div>

                                {/* Vital Shield Card */}
                                <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[60px] border-2 border-pink-100 shadow-xl shadow-pink-100/30 relative group hover:-translate-y-4 transition-all duration-500">
                                    <div className="absolute top-6 right-6">
                                        <div className="w-3 h-3 bg-pink-400 rounded-full animate-ping"></div>
                                    </div>
                                    <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-8">
                                        <Shield className="w-7 h-7 text-pink-600" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Vital Parameters</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Normal BP</span>
                                            <span className="font-black text-slate-900">115/75</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Stress Sync</span>
                                            <span className="font-black text-slate-900 text-sm">Balanced</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Deep Rest Card */}
                                <div className="bg-slate-900 p-10 rounded-[60px] shadow-2xl shadow-indigo-900/40 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent"></div>
                                    <div className="relative z-10 h-full flex flex-col justify-between">
                                        <div>
                                            <Moon className="w-10 h-10 text-indigo-400 mb-8" />
                                            <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Neural Sync</h3>
                                            <p className="text-indigo-200/60 text-sm font-medium leading-relaxed">
                                                Prioritize deep-wave recovery to facilitate cellular repair and memory consolidation.
                                            </p>
                                        </div>
                                        <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-4">
                                            <div className="flex -space-x-3">
                                                {[1, 2, 3].map(i => <div key={i} className={`w-8 h-8 rounded-full bg-indigo-${i}00 border-2 border-slate-900 shadow-lg`} />)}
                                            </div>
                                            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">7-9H Targets</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </section>

                {/* Team / Research Footer */}
                <div className="mt-20 text-center">
                    <p className="text-[12px] font-black tracking-[0.2em] text-slate-400 uppercase mb-4">
                        Academic Research Project • 2026
                    </p>
                    <div className="flex justify-center gap-6">
                        <div className="w-10 h-1 border-t-2 border-purple-200 font-black"></div>
                        <div className="w-10 h-1 border-t-2 border-purple-200 font-black"></div>
                        <div className="w-10 h-1 border-t-2 border-purple-200 font-black"></div>
                    </div>
                </div>
            </div>
        </main>
    );
}
