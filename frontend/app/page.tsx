"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Activity, Shield, Zap, ChevronRight, Brain, Clock } from "lucide-react";

export default function Home() {
  const [detailedMetrics, setDetailedMetrics] = useState<any>(null);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    fetch(`${baseUrl}/detailed_metrics`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setDetailedMetrics(data);
        }
      })
      .catch((err) => console.error("Failed to fetch detailed metrics", err));
  }, []);

  return (
    <main className="min-h-screen bg-[#f0effb] text-slate-900 font-sans selection:bg-purple-200 selection:text-purple-900">
      {/* Enhanced Pastel Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-purple-200/50 rounded-full blur-[100px] -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-pink-200/50 rounded-full blur-[100px] translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 lg:pt-48 lg:pb-32 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-200 rounded-full px-4 py-1.5 mb-8 shadow-sm backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
                </span>
                <span className="text-sm font-bold text-purple-800 tracking-wide uppercase text-[11px]">
                  Next Gen Health AI
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold mb-8 leading-tight tracking-tight text-slate-900">
                Predict Health Risks <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600">
                  Before They Happen
                </span>
              </h1>

              <p className="text-xl text-slate-700 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Leverage state-of-the-art machine learning algorithms to assess cardiovascular disease risk with unprecedented accuracy and care.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link
                  href="/predict"
                  className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-purple-200 hover:shadow-2xl hover:shadow-purple-300 flex items-center justify-center gap-2 group"
                >
                  Start Analysis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/about"
                  className="px-8 py-4 bg-white hover:bg-slate-50 border-2 border-purple-100 text-purple-900 rounded-2xl font-bold text-lg transition-all shadow-md flex items-center justify-center gap-2"
                >
                  Learn Methodology
                </Link>
              </div>

              {/* Stats Row */}
              <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 border-t-2 border-purple-100/50 pt-10 max-w-2xl mx-auto lg:mx-0">
                <div>
                  <div className="text-4xl font-black text-purple-900 mb-1">
                    {detailedMetrics
                      ? (detailedMetrics.accuracy * 100).toFixed(1) + "%"
                      : "73.0%"}
                  </div>
                  <div className="text-purple-700/70 text-xs font-bold uppercase tracking-widest">Model Accuracy</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-purple-900 mb-1">70k+</div>
                  <div className="text-purple-700/70 text-xs font-bold uppercase tracking-widest">Patient Records</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-purple-900 mb-1">
                    {detailedMetrics
                      ? detailedMetrics.roc_auc.toFixed(3)
                      : "0.805"}
                  </div>
                  <div className="text-purple-700/70 text-xs font-bold uppercase tracking-widest">ROC-AUC Score</div>
                </div>
              </div>
            </div>

            {/* Right Visual (Interactive Card) */}
            <div className="flex-1 relative w-full max-w-md lg:max-w-full">
              <div className="relative z-10 bg-white/90 border-2 border-purple-100 rounded-[32px] p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-white/50">
                {/* Mock UI Header */}
                <div className="flex items-center justify-between mb-8 border-b-2 border-purple-50 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-200">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-base font-bold text-slate-800">Prediction Engine</div>
                      <div className="text-xs text-purple-700 font-bold uppercase tracking-tighter">Live Dataset Analysis</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                </div>

                {/* Mock Stats */}
                <div className="space-y-5">
                  <div className="bg-purple-50/50 rounded-2xl p-5 flex items-center justify-between border-2 border-transparent hover:border-purple-200 transition-all group shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <Activity className="w-6 h-6 text-emerald-600" />
                      <span className="text-slate-700 text-sm font-bold">Systolic Pressure</span>
                    </div>
                    <span className="text-slate-900 font-black font-mono bg-white px-3 py-1 rounded-lg border border-purple-50">120</span>
                  </div>
                  <div className="bg-purple-50/50 rounded-2xl p-5 flex items-center justify-between border-2 border-transparent hover:border-purple-200 transition-all group shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <Zap className="w-6 h-6 text-amber-600" />
                      <span className="text-slate-700 text-sm font-bold">Cholesterol</span>
                    </div>
                    <span className="text-slate-900 font-black font-mono bg-white px-3 py-1 rounded-lg border border-purple-50">Normal</span>
                  </div>

                  {/* Mock Result */}
                  <div className="mt-8 pt-8 border-t-2 border-purple-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-slate-500 font-bold tracking-wide">AI Recommendation</span>
                      <span className="text-xs text-indigo-700 font-black bg-indigo-100 px-3 py-1 rounded-full uppercase">Optimal</span>
                    </div>
                    <div className="h-3 bg-purple-100 rounded-full overflow-hidden p-0.5 border border-purple-50">
                      <div className="h-full w-[25%] bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse focus:outline-none"></div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 bg-white p-5 rounded-2xl border-2 border-purple-100 shadow-2xl animate-bounce duration-[5000ms]">
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <Activity className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Decorative pastel blob behind card */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-300/40 to-indigo-300/40 blur-[80px] -z-10 rounded-full transform rotate-12 scale-110"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white/40 border-t-2 border-purple-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-slate-900 uppercase tracking-tight">Why Choose CardioPredict?</h2>
            <div className="w-24 h-1.5 bg-purple-600 mx-auto rounded-full mb-8"></div>
            <p className="text-slate-600 max-w-2xl mx-auto text-xl leading-relaxed font-medium capitalize">Advanced clinical insights meets modern AI diagnostics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[{
              icon: <Clock className="w-7 h-7 text-white" />,
              title: "Instant Results",
              desc: "Get immediate risk assessments processed by our optimized ML pipeline in milliseconds.",
              color: "bg-purple-500"
            }, {
              icon: <Shield className="w-7 h-7 text-white" />,
              title: "Privacy First",
              desc: "Your data is processed locally within the session context and never stored permanently.",
              color: "bg-indigo-500"
            }, {
              icon: <Brain className="w-7 h-7 text-white" />,
              title: "Advanced Models",
              desc: "Utilizing XGBoost, CatBoost, and Random Forest for ensemble-grade prediction accuracy.",
              color: "bg-pink-500"
            }].map((feature, i) => (
              <div key={i} className="p-10 bg-white border-2 border-purple-50 hover:border-purple-300 rounded-[32px] transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-200 group">
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-base font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-100 border-t-2 border-purple-50 text-slate-600 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
            <div>
              <h3 className="text-slate-900 text-3xl font-black mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                CardioPredict AI
              </h3>
              <p className="max-w-md text-slate-700 text-lg leading-relaxed font-medium italic">
                Empowering individuals and healthcare providers with AI-driven insights for early detection and prevention of cardiovascular diseases.
              </p>
            </div>
            <div className="md:text-right">
              <h3 className="text-slate-900 text-xl font-black mb-8 tracking-widest uppercase">
                Project Technicals
              </h3>
              <ul className="space-y-4 font-bold text-sm">
                <li><span className="text-purple-600/50 uppercase text-[10px] tracking-[0.2em] mr-3">Framework</span> Next.js 14 + FastAPI</li>
                <li><span className="text-purple-600/50 uppercase text-[10px] tracking-[0.2em] mr-3">ML Stack</span> Scikit-Learn Ensemble</li>
                <li><span className="text-purple-600/50 uppercase text-[10px] tracking-[0.2em] mr-3">Dataset</span> Global Heart Disease Dataset</li>
                <li><span className="text-purple-600/50 uppercase text-[10px] tracking-[0.2em] mr-3">Status</span> Production Grade v1.0</li>
              </ul>
            </div>
          </div>
          <div className="border-t-2 border-slate-200 pt-10 text-center text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
            © 2025 CardioPredict AI • Advanced Medical Research Implementation
          </div>
        </div>
      </footer>
    </main>
  );
}