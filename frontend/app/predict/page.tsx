"use client";

import { useState } from "react";
import { Activity, Heart, AlertTriangle, CheckCircle2, Cpu, Zap, BarChart3, Brain } from "lucide-react";

export default function PredictPage() {
    const [formData, setFormData] = useState({
        gender: "Female",
        age: 50,
        height: 165,
        weight: 70.0,
        ap_hi: 120,
        ap_lo: 80,
        cholesterol: "Normal",
        glucose: "Normal",
        smoke: "No",
        alco: "No",
        active: "Active",
        model_name: "CatBoost",
    });

    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);

        // Map inputs to API expected format
        const payload = {
            gender: formData.gender === "Female" ? 1 : 2,
            age: Number(formData.age),
            height: Number(formData.height),
            weight: Number(formData.weight),
            ap_hi: Number(formData.ap_hi),
            ap_lo: Number(formData.ap_lo),
            cholesterol:
                formData.cholesterol === "Low"
                    ? 1
                    : formData.cholesterol === "Normal"
                        ? 2
                        : 3,
            glucose:
                formData.glucose === "Low" ? 1 : formData.glucose === "Normal" ? 2 : 3,
            smoke: formData.smoke === "No" ? 0 : 1,
            alco: formData.alco === "No" ? 0 : 1,
            active: formData.active === "Sedentary" ? 0 : 1,
            model_name: formData.model_name,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/predict`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch prediction");
            }

            const data = await response.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f0effb] text-slate-900 font-sans selection:bg-purple-200 selection:text-purple-900 pb-20">
            {/* Enhanced Pastel Background Gradients */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[100px] -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-pink-200/40 rounded-full blur-[100px] translate-y-1/2"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 pt-32">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
                            <Brain className="w-4 h-4 text-purple-600" />
                            <span className="text-[11px] font-black text-purple-800 tracking-widest uppercase">
                                Precision Diagnostics
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                            Risk <span className="text-purple-600">Assessment</span>
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                            Our advanced neural networks analyze 12 clinical parameters to provide real-time cardiovascular risk estimations.
                        </p>
                    </div>

                    <div className="bg-white/90 backdrop-blur-3xl rounded-[40px] shadow-2xl border-2 border-purple-100/50 overflow-hidden ring-1 ring-white/50">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-10 text-white relative">
                            <div className="relative z-10">
                                <h2 className="text-3xl font-black mb-2 tracking-tight">Clinical Metrics</h2>
                                <p className="text-purple-100 font-medium opacity-90">
                                    Fill in your data with clinical precision
                                </p>
                            </div>
                            <Activity className="absolute right-10 top-1/2 -translate-y-1/2 w-32 h-32 text-white/10" />
                        </div>

                        <div className="p-10 md:p-14">
                            <form onSubmit={handleSubmit} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                    {/* Gender */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                                            Gender
                                        </label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl border-2 border-purple-50 bg-purple-50/30 focus:border-purple-400 focus:bg-white transition-all p-4 text-slate-900 font-bold outline-none"
                                        >
                                            <option>Female</option>
                                            <option>Male</option>
                                        </select>
                                    </div>

                                    {/* Age */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                                            Age (Years)
                                        </label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                            min="10"
                                            max="100"
                                            className="w-full rounded-2xl border-2 border-purple-50 bg-purple-50/30 focus:border-purple-400 focus:bg-white transition-all p-4 text-slate-900 font-bold outline-none"
                                        />
                                    </div>

                                    {/* Height & Weight Group */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                                            Height (CM)
                                        </label>
                                        <input
                                            type="number"
                                            name="height"
                                            value={formData.height}
                                            onChange={handleChange}
                                            min="50"
                                            max="250"
                                            className="w-full rounded-2xl border-2 border-purple-50 bg-purple-50/30 focus:border-purple-400 focus:bg-white transition-all p-4 text-slate-900 font-bold outline-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                                            Weight (KG)
                                        </label>
                                        <input
                                            type="number"
                                            name="weight"
                                            value={formData.weight}
                                            onChange={handleChange}
                                            min="30"
                                            max="200"
                                            step="0.1"
                                            className="w-full rounded-2xl border-2 border-purple-50 bg-purple-50/30 focus:border-purple-400 focus:bg-white transition-all p-4 text-slate-900 font-bold outline-none"
                                        />
                                    </div>

                                    {/* Pressure Group */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                                            Systolic (AP_HI)
                                        </label>
                                        <input
                                            type="number"
                                            name="ap_hi"
                                            value={formData.ap_hi}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl border-2 border-purple-50 bg-purple-50/30 focus:border-purple-400 focus:bg-white transition-all p-4 text-slate-900 font-bold outline-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                                            Diastolic (AP_LO)
                                        </label>
                                        <input
                                            type="number"
                                            name="ap_lo"
                                            value={formData.ap_lo}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl border-2 border-purple-50 bg-purple-50/30 focus:border-purple-400 focus:bg-white transition-all p-4 text-slate-900 font-bold outline-none"
                                        />
                                    </div>

                                    {/* Selects */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                                            Cholesterol
                                        </label>
                                        <select
                                            name="cholesterol"
                                            value={formData.cholesterol}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl border-2 border-purple-50 bg-purple-50/30 focus:border-purple-400 focus:bg-white transition-all p-4 text-slate-900 font-bold outline-none"
                                        >
                                            <option>Low</option>
                                            <option>Normal</option>
                                            <option>High</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                                            Glucose
                                        </label>
                                        <select
                                            name="glucose"
                                            value={formData.glucose}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl border-2 border-purple-50 bg-purple-50/30 focus:border-purple-400 focus:bg-white transition-all p-4 text-slate-900 font-bold outline-none"
                                        >
                                            <option>Low</option>
                                            <option>Normal</option>
                                            <option>High</option>
                                        </select>
                                    </div>

                                    {/* Radios Switched to Styled Group */}
                                    <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                                        {[
                                            { label: "Smoker", name: "smoke" },
                                            { label: "Alcohol", name: "alco" },
                                            { label: "Activity", name: "active", labels: ["Sedentary", "Active"] }
                                        ].map((item) => (
                                            <div key={item.name} className="space-y-3">
                                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                                                    {item.label}
                                                </label>
                                                <div className="flex bg-purple-50/50 p-1.5 rounded-2xl border-2 border-purple-50">
                                                    {(item.labels || ["No", "Yes"]).map((opt) => (
                                                        <button
                                                            key={opt}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, [item.name]: opt })}
                                                            className={`flex-1 py-2 px-4 rounded-xl text-sm font-black transition-all ${(formData as any)[item.name] === opt
                                                                ? "bg-white text-purple-700 shadow-md"
                                                                : "text-slate-400 hover:text-slate-600"
                                                                }`}
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Model Selection Cards */}
                                    <div className="col-span-1 md:col-span-2 pt-6">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 block mb-6">
                                            AI Engine Configuration
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            {[
                                                {
                                                    id: "CatBoost",
                                                    name: "CatBoost",
                                                    desc: "Proprietary gradient boosting",
                                                    accuracy: "72.8%",
                                                    recommended: true,
                                                    icon: <Zap className="w-5 h-5 text-amber-500" />
                                                },
                                                {
                                                    id: "XGBoost",
                                                    name: "XGBoost",
                                                    desc: "Extreme gradient optimized",
                                                    accuracy: "72.5%",
                                                    icon: <Cpu className="w-5 h-5 text-purple-500" />
                                                },
                                                {
                                                    id: "Random Forest",
                                                    name: "Random Forest",
                                                    desc: "Multi-tree logic voting",
                                                    accuracy: "72.7%",
                                                    icon: <BarChart3 className="w-5 h-5 text-indigo-500" />
                                                },
                                                {
                                                    id: "Logistic Regression",
                                                    name: "Logistic Reg",
                                                    desc: "Linear probability mapping",
                                                    accuracy: "71.9%",
                                                    icon: <Activity className="w-5 h-5 text-pink-500" />
                                                },
                                            ].map((model) => (
                                                <button
                                                    key={model.id}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, model_name: model.id })}
                                                    className={`group relative p-6 rounded-[24px] border-2 text-left transition-all ${formData.model_name === model.id
                                                        ? "border-purple-600 bg-purple-50/50 shadow-xl shadow-purple-100"
                                                        : "border-purple-50 bg-slate-50/30 hover:border-purple-200 hover:bg-white"
                                                        }`}
                                                >
                                                    {formData.model_name === model.id && (
                                                        <div className="absolute top-4 right-4">
                                                            <div className="bg-purple-600 rounded-full p-1 shadow-lg">
                                                                <CheckCircle2 className="w-4 h-4 text-white" />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {model.recommended && (
                                                        <span className="absolute -top-3 left-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                                            Recommended
                                                        </span>
                                                    )}
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className={`p-3 rounded-2xl transition-colors ${formData.model_name === model.id ? 'bg-white shadow-md' : 'bg-purple-100/50'}`}>
                                                            {model.icon}
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-slate-900 leading-none mb-1">{model.name}</div>
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Confidence Index</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-slate-500 font-medium mb-4 line-clamp-1">
                                                        {model.desc}
                                                    </div>
                                                    <div className="flex items-center justify-between border-t border-purple-100/50 pt-4">
                                                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Accuracy</span>
                                                        <span className="text-sm font-black text-purple-700">{model.accuracy}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full relative group overflow-hidden bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-[24px] font-black text-xl shadow-2xl shadow-purple-200 transition-all hover:-translate-y-1 active:translate-y-0 disabled:bg-purple-300"
                                    >
                                        <div className="relative z-10 flex items-center justify-center gap-3">
                                            {loading ? (
                                                <>
                                                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Calculating Risk...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Zap className="w-6 h-6 fill-white" />
                                                    <span>Generate Health Report</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                                    </button>
                                </div>
                            </form>

                            {error && (
                                <div className="mt-10 p-6 bg-red-50 border-2 border-red-100 rounded-[24px] text-red-600 font-bold flex items-center gap-4 animate-shake">
                                    <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>
                                    {error}
                                </div>
                            )}

                            {result && (() => {
                                const probability = result.probability;
                                const isModerate = probability >= 0.3 && probability <= 0.6;
                                const isHigh = probability > 0.6;

                                let theme = {
                                    bg: "bg-emerald-50/50",
                                    border: "border-emerald-200/50",
                                    text: "text-emerald-900",
                                    accent: "emerald",
                                    label: "Low Risk",
                                    message: "Optimal clinical signs. Your metrics are within healthy neural benchmarks. Maintain your focus on cardiovascular wellness.",
                                    icon: <Heart className="w-10 h-10 text-emerald-600" />
                                };

                                if (isHigh) {
                                    theme = {
                                        bg: "bg-rose-50/50",
                                        border: "border-rose-200/50",
                                        text: "text-rose-900",
                                        accent: "rose",
                                        label: "High Risk",
                                        message: "Critical clinical alert. The prediction engine has identified significant risk markers. Urgent consultation with a healthcare professional is recommended.",
                                        icon: <Activity className="w-10 h-10 text-rose-600" />
                                    };
                                } else if (isModerate) {
                                    theme = {
                                        bg: "bg-amber-50/50",
                                        border: "border-amber-200/50",
                                        text: "text-amber-900",
                                        accent: "amber",
                                        label: "Moderate Risk",
                                        message: "Precautionary status. Some metrics deviate from optimal ranges. Routine clinical screening and lifestyle adjustments may be beneficial.",
                                        icon: <AlertTriangle className="w-10 h-10 text-amber-600" />
                                    };
                                }

                                return (
                                    <div className={`mt-16 p-10 rounded-[40px] border-2 transition-all animate-fade-in shadow-2xl ${theme.bg} ${theme.border}`}>
                                        <div className="flex flex-col md:flex-row items-center gap-10">
                                            <div className="relative">
                                                <div className={`w-32 h-32 bg-white rounded-[32px] shadow-xl flex items-center justify-center relative z-10 border-2 ${theme.border}`}>
                                                    {theme.icon}
                                                </div>
                                                <div className={`absolute inset-0 bg-${theme.accent}-400/20 blur-[30px] rounded-full animate-pulse`}></div>
                                            </div>
                                            <div className="flex-1 text-center md:text-left">
                                                <div className={`inline-flex items-center px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 bg-white border-2 ${theme.border} ${theme.text}`}>
                                                    {theme.label}
                                                </div>
                                                <h3 className={`text-5xl font-black mb-4 tracking-tighter ${theme.text}`}>
                                                    {(probability * 100).toFixed(1)}% <span className="text-2xl opacity-60 font-medium tracking-normal">Probability</span>
                                                </h3>
                                                <p className={`text-lg font-medium opacity-80 leading-relaxed ${theme.text}`}>
                                                    {theme.message}
                                                </p>
                                            </div>
                                        </div>

                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
