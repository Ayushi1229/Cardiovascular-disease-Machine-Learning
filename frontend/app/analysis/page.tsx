"use client";

import { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";
import {
    Activity,
    BarChart as BarChartIcon,
    Database,
    Zap,
} from "lucide-react";

export default function AnalysisPage() {
    const fallbackMetricsObj: Record<string, number> = {
        "Logistic Regression": 0.7194048952167653,
        "Random Forest": 0.7277235642297233,
        "XGBoost": 0.725323948168293,
        "CatBoost": 0.7283634618461047,
    };

    const [metrics, setMetrics] = useState<any[]>(
        Object.keys(fallbackMetricsObj).map((key) => ({
            name: key,
            accuracy: parseFloat((fallbackMetricsObj[key] * 100).toFixed(1)),
        }))
    );
    const [detailedMetrics, setDetailedMetrics] = useState<any>(null);

    useEffect(() => {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

        fetch(`${baseUrl}/metrics`)
            .then((res) => res.json())
            .then((data) => {
                if (data && !data.error && Object.keys(data).length > 0) {
                    const formattedMetrics = Object.keys(data).map((key) => ({
                        name: key,
                        accuracy: parseFloat((data[key] * 100).toFixed(1)),
                    }));
                    formattedMetrics.sort((a, b) => b.accuracy - a.accuracy);
                    setMetrics(formattedMetrics);
                } else {
                    console.warn("Metrics endpoint returned empty or error; using fallback metrics.");
                }
            })
            .catch((err) => {
                console.error("Failed to fetch metrics", err);
            });

        fetch(`${baseUrl}/detailed_metrics`)
            .then((res) => res.json())
            .then((data) => {
                if (data && !data.error) {
                    setDetailedMetrics(data);
                }
            })
            .catch((err) => console.error("Failed to fetch detailed metrics", err));
    }, []);


    // Mock data for charts where backend data is missing
    const rocData = detailedMetrics?.roc_curve || [
        { x: 0, y: 0 },
        { x: 0.1, y: 0.4 },
        { x: 0.2, y: 0.6 },
        { x: 0.3, y: 0.7 },
        { x: 0.4, y: 0.75 },
        { x: 0.5, y: 0.8 },
        { x: 0.6, y: 0.85 },
        { x: 0.7, y: 0.9 },
        { x: 0.8, y: 0.95 },
        { x: 0.9, y: 0.98 },
        { x: 1, y: 1 },
    ];

    const featureImportance = detailedMetrics?.feature_importance
        ? detailedMetrics.feature_importance.map((item: any) => ({
            name: item.name,
            value: parseFloat((item.value * 100).toFixed(1)),
        }))
        : [
            { name: "Systolic BP", value: 24.7 },
            { name: "Diastolic BP", value: 14 },
            { name: "Age", value: 14 },
            { name: "Cholesterol", value: 12 },
            { name: "Glucose", value: 10 },
            { name: "Weight", value: 8 },
            { name: "Active", value: 7 },
            { name: "Smoke", value: 5 },
            { name: "Alcohol", value: 3 },
            { name: "Gender", value: 2 },
            { name: "Height", value: 0.3 },
        ];

    return (
        <main className="min-h-screen bg-[#f0effb] text-slate-900 font-sans selection:bg-purple-200 selection:text-purple-900 pb-20">
            {/* Enhanced Pastel Background Gradients */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-purple-200/50 rounded-full blur-[100px] -translate-y-1/2"></div>
                <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-pink-100/50 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 pt-32">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
                        <BarChartIcon className="w-4 h-4 text-purple-600" />
                        <span className="text-[11px] font-black text-purple-800 tracking-widest uppercase">
                            Model Intelligence Hub
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                        Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600">Analytics</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                        Deep-dive into our neural network performance metrics, diagnostic accuracy, and decision-making logic.
                    </p>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16 px-4">
                    {[
                        { label: "Accuracy", value: detailedMetrics?.accuracy ? (detailedMetrics.accuracy * 100).toFixed(1) + "%" : "74.0%", icon: <Activity className="w-5 h-5" color="#9333ea" /> },
                        { label: "Precision", value: detailedMetrics?.precision ? (detailedMetrics.precision * 100).toFixed(1) + "%" : "76.0%", icon: <Zap className="w-5 h-5" color="#db2777" /> },
                        { label: "Recall", value: detailedMetrics?.recall ? (detailedMetrics.recall * 100).toFixed(1) + "%" : "70.1%", icon: <BarChartIcon className="w-5 h-5" color="#4f46e5" /> },
                        { label: "F1 Score", value: detailedMetrics?.f1_score ? detailedMetrics.f1_score.toFixed(3) : "0.730", icon: <Database className="w-5 h-5" color="#059669" /> }
                    ].map((kpi, i) => (
                        <div key={i} className="bg-white/80 backdrop-blur-xl p-8 rounded-[32px] border-2 border-purple-100 shadow-xl shadow-purple-100/20 group hover:-translate-y-1 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                {kpi.icon}
                            </div>
                            <div className="text-3xl font-black text-slate-900 mb-1">{kpi.value}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto mb-12">
                    {/* Accuracy Chart */}
                    <div className="bg-white/90 backdrop-blur-3xl p-8 rounded-[40px] shadow-2xl border-2 border-purple-100/50 ring-1 ring-white/50">
                        <h3 className="text-xl font-black mb-8 text-slate-900 flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg"><BarChartIcon className="w-5 h-5 text-purple-600" /></div>
                            Algorithm Accuracy
                        </h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={metrics}
                                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                                >
                                    <defs>
                                        <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#7e22ce" stopOpacity={1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} height={60} angle={-20} textAnchor="end" />
                                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                                            borderRadius: "16px",
                                            border: "2px solid #f1f5f9",
                                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                            backdropFilter: "blur(4px)"
                                        }}
                                        cursor={{ fill: '#f8fafc' }}
                                    />
                                    <Bar
                                        dataKey="accuracy"
                                        fill="url(#purpleGradient)"
                                        radius={[10, 10, 0, 0]}
                                        barSize={40}
                                        name="Accuracy (%)"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* ROC Curve */}
                    <div className="bg-white/90 backdrop-blur-3xl p-8 rounded-[40px] shadow-2xl border-2 border-purple-100/50 ring-1 ring-white/50">
                        <h3 className="text-xl font-black mb-8 text-slate-900 flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg"><Activity className="w-5 h-5 text-indigo-600" /></div>
                            ROC Curve Analysis
                        </h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={rocData}
                                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="x"
                                        type="number"
                                        domain={[0, 1]}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                                    />
                                    <YAxis
                                        dataKey="y"
                                        type="number"
                                        domain={[0, 1]}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                                    />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="y"
                                        stroke="#4f46e5"
                                        strokeWidth={4}
                                        dot={false}
                                        animationDuration={2000}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="x"
                                        stroke="#cbd5e1"
                                        strokeDasharray="10 10"
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Confusion Matrix */}
                    <div className="bg-white/90 backdrop-blur-3xl p-8 rounded-[40px] shadow-2xl border-2 border-purple-100/50 ring-1 ring-white/50">
                        <h3 className="text-xl font-black mb-10 text-slate-900 flex items-center gap-3">
                            <div className="p-2 bg-pink-100 rounded-lg"><Database className="w-5 h-5 text-pink-600" /></div>
                            Confusion Mapping
                        </h3>
                        <div className="grid grid-cols-2 gap-6 h-72">
                            {[
                                { val: detailedMetrics?.confusion_matrix?.tn ?? "5454", label: "True Negative", sub: "(Correct: Healthy)", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
                                { val: detailedMetrics?.confusion_matrix?.fp ?? "1550", label: "False Positive", sub: "(Error: Risk)", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100" },
                                { val: detailedMetrics?.confusion_matrix?.fn ?? "2093", label: "False Negative", sub: "(Error: Healthy)", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-100" },
                                { val: detailedMetrics?.confusion_matrix?.tp ?? "4903", label: "True Positive", sub: "(Correct: Risk)", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-100" }
                            ].map((box, i) => (
                                <div key={i} className={`${box.bg} ${box.border} border-2 p-5 rounded-3xl flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] cursor-default`}>
                                    <div className={`text-3xl font-black ${box.text} mb-1`}>{box.val}</div>
                                    <div className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">{box.label}</div>
                                    <div className="text-[9px] font-bold opacity-60 uppercase">{box.sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Feature Importance */}
                    <div className="bg-white/90 backdrop-blur-3xl p-8 rounded-[40px] shadow-2xl border-2 border-purple-100/50 ring-1 ring-white/50">
                        <h3 className="text-xl font-black mb-8 text-slate-900 flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg"><BarChartIcon className="w-5 h-5 text-emerald-600" /></div>
                            Risk Factor Impact
                        </h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    layout="vertical"
                                    data={featureImportance}
                                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                                >
                                    <defs>
                                        <linearGradient id="tealGradient" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#059669" stopOpacity={1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} />
                                    <Tooltip cursor={{ fill: '#f0fdf4' }} />
                                    <Bar
                                        dataKey="value"
                                        fill="url(#tealGradient)"
                                        radius={[0, 10, 10, 0]}
                                        barSize={20}
                                        name="Importance (%)"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Detailed Model Comparison Chart */}
                <div className="bg-white/90 backdrop-blur-3xl p-10 rounded-[48px] shadow-2xl border-2 border-purple-100/50 ring-1 ring-white/50 mb-12 max-w-6xl mx-auto">
                    <h3 className="text-2xl font-black mb-10 text-slate-900 flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center"><BarChartIcon className="w-6 h-6 text-indigo-600" /></div>
                        Deep Neural Comparison
                    </h3>
                    <div className="h-96 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={
                                    detailedMetrics?.all_models_metrics
                                        ? detailedMetrics.all_models_metrics.map((m: any) => ({
                                            name: m.name,
                                            Accuracy: parseFloat((m.accuracy * 100).toFixed(1)),
                                            Precision: parseFloat((m.precision * 100).toFixed(1)),
                                            Recall: parseFloat((m.recall * 100).toFixed(1)),
                                            "F1 Score": parseFloat((m.f1 * 100).toFixed(1)),
                                        }))
                                        : []
                                }
                                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} height={60} angle={-20} textAnchor="end" />
                                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 800 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        borderRadius: "20px",
                                        border: "2px solid #f1f5f9",
                                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                                    }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }} />
                                <Bar dataKey="Accuracy" fill="#9333ea" radius={[6, 6, 0, 0]} barSize={25} />
                                <Bar dataKey="Precision" fill="#db2777" radius={[6, 6, 0, 0]} barSize={25} />
                                <Bar dataKey="Recall" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={25} />
                                <Bar dataKey="F1 Score" fill="#059669" radius={[6, 6, 0, 0]} barSize={25} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Training Phase Line Chart */}
                <div className="bg-slate-900 p-12 rounded-[48px] shadow-2xl border-2 border-slate-800 ring-1 ring-white/10 max-w-6xl mx-auto mb-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black mb-10 text-white flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20"><Activity className="w-6 h-6 text-purple-400" /></div>
                            Training Convergence
                        </h3>
                        <div className="h-96 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={detailedMetrics?.training_history || []}
                                    margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                    <XAxis
                                        dataKey="name"
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                        interval={0}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                                    />
                                    <YAxis domain={[50, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#0f172a",
                                            borderRadius: "16px",
                                            border: "1px solid #1e293b",
                                            color: "#fff"
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="accuracy"
                                        stroke="#a855f7"
                                        strokeWidth={5}
                                        dot={{ r: 6, fill: '#a855f7', strokeWidth: 3, stroke: '#0f172a' }}
                                        activeDot={{ r: 10 }}
                                        name="Accuracy Index"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
