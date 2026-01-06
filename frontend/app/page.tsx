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
  Heart,
  Shield,
  Zap,
  Database,
  Cpu,
  BarChart as BarChartIcon,
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowRight,
} from "lucide-react";

export default function Home() {
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
    model_name: "XGBoost",
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [metrics, setMetrics] = useState<any[]>([]);
  const [detailedMetrics, setDetailedMetrics] = useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/metrics`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          const formattedMetrics = Object.keys(data).map((key) => ({
            name: key,
            accuracy: parseFloat((data[key] * 100).toFixed(1)),
          }));
          setMetrics(formattedMetrics);
          console.log(metrics);
        }
      })
      .catch((err) => console.error("Failed to fetch metrics", err));

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/detailed_metrics`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setDetailedMetrics(data);
        }
      })
      .catch((err) => console.error("Failed to fetch detailed metrics", err));
  }, []);

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/predict`, {
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

  const scrollToPrediction = () => {
    const element = document.getElementById("prediction-form");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-slate-900 pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/20 blur-[100px] transform translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-1/3 h-full bg-purple-600/20 blur-[100px] transform -translate-x-1/3" />
        </div>

        <div className="container relative mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-500/30 text-blue-300 text-sm font-medium backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              AI-Powered Health Analysis
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
              Predict Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Heart Health</span> with Precision
            </h1>

            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Advanced machine learning algorithm trained on 70,000+ patient records to provide accurate cardiovascular risk assessments in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={scrollToPrediction}
                className="group relative px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                Start Assessment
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-slate-800 text-white border border-slate-700 rounded-full font-bold text-lg hover:bg-slate-700 transition-all">
                View Research
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-12 border-t border-slate-800 mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-1">
                  {detailedMetrics ? (detailedMetrics.accuracy * 100).toFixed(1) : "73.97"}%
                </div>
                <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-1">70K+</div>
                <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Patient Records</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-1">
                  {detailedMetrics ? detailedMetrics.roc_auc.toFixed(3) : "0.805"}
                </div>
                <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">ROC-AUC Score</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Disclaimer */}
      <section className="w-full bg-amber-50 border-b border-amber-200 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="flex gap-4 max-w-4xl mx-auto">
            <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-bold text-amber-800 text-lg">Medical Disclaimer</h3>
              <p className="text-amber-700 text-sm">
                This AI model is for <strong>educational purposes only</strong>. It should NOT replace professional medical advice.
              </p>
              <ul className="text-amber-700 text-sm list-disc list-inside space-y-1">
                <li>Always consult qualified healthcare providers</li>
                <li>Results must be validated by medical professionals</li>
                <li>This is an academic ML/DL project</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Model Information */}
      <section className="w-full bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Model Information</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built with scikit-learn, trained on the Kaggle Cardiovascular Disease dataset
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">ML Algorithm</h3>
              <p className="text-gray-600 text-sm">CatBoost classifier with optimal hyperparameters</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Dataset</h3>
              <p className="text-gray-600 text-sm">70,000 patient records from Kaggle</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Performance</h3>
              <p className="text-gray-600 text-sm">73.97% accuracy with rigorous validation</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Real-time</h3>
              <p className="text-gray-600 text-sm">Instant cardiovascular risk prediction</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              4-step prediction workflow for accurate cardiovascular risk assessment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { step: "01", title: "Data Input", desc: "Patient health metrics collected" },
              { step: "02", title: "Preprocessing", desc: "Data cleaned and validated" },
              { step: "03", title: "ML Algorithm", desc: "CatBoost model processes features" },
              { step: "04", title: "Risk Prediction", desc: "Risk probability calculated" },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="text-4xl font-bold text-gray-300 mb-3">{item.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prediction Form */}
      <section id="prediction-form" className="w-full bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="max-w-3xl mx-auto bg-white rounded-lg border border-gray-200 overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold">Get Your Prediction</h2>
              <p className="text-blue-100 mt-2">Enter your health metrics for instant assessment</p>
            </div>

            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>Female</option>
                      <option>Male</option>
                    </select>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      min="10"
                      max="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Height */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      min="50"
                      max="250"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      min="30"
                      max="200"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Systolic BP */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Systolic BP</label>
                    <input
                      type="number"
                      name="ap_hi"
                      value={formData.ap_hi}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Diastolic BP */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diastolic BP</label>
                    <input
                      type="number"
                      name="ap_lo"
                      value={formData.ap_lo}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Cholesterol */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cholesterol</label>
                    <select
                      name="cholesterol"
                      value={formData.cholesterol}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>Low</option>
                      <option>Normal</option>
                      <option>High</option>
                    </select>
                  </div>

                  {/* Glucose */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Glucose</label>
                    <select
                      name="glucose"
                      value={formData.glucose}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>Low</option>
                      <option>Normal</option>
                      <option>High</option>
                    </select>
                  </div>

                  {/* Smoke */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Smoker?</label>
                    <div className="flex gap-6">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="smoke"
                          value="No"
                          checked={formData.smoke === "No"}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">No</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="smoke"
                          value="Yes"
                          checked={formData.smoke === "Yes"}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">Yes</span>
                      </label>
                    </div>
                  </div>

                  {/* Alcohol */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alcohol Intake?</label>
                    <div className="flex gap-6">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="alco"
                          value="No"
                          checked={formData.alco === "No"}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">No</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="alco"
                          value="Yes"
                          checked={formData.alco === "Yes"}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">Yes</span>
                      </label>
                    </div>
                  </div>

                  {/* Active */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Physical Activity?</label>
                    <div className="flex gap-6">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="active"
                          value="Sedentary"
                          checked={formData.active === "Sedentary"}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">Sedentary</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="active"
                          value="Active"
                          checked={formData.active === "Active"}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">Active</span>
                      </label>
                    </div>
                  </div>

                  {/* Model Selection */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                    <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-medium">
                      CatBoost (Highest Accuracy)
                    </div>
                    <input type="hidden" name="model_name" value="CatBoost" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? "Analyzing..." : "Get Cardiovascular Risk Assessment"}
                </button>
              </form>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {result && (
                <div className={`mt-8 p-6 rounded-lg text-center border-2 ${result.prediction === 1
                  ? "bg-red-50 border-red-200"
                  : "bg-green-50 border-green-200"
                  }`}>
                  <div className="flex justify-center mb-4">
                    {result.prediction === 1 ? (
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <Activity className="w-8 h-8 text-red-600" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <Heart className="w-8 h-8 text-green-600" />
                      </div>
                    )}
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${result.prediction === 1 ? "text-red-800" : "text-green-800"
                    }`}>
                    {result.risk} Risk
                  </h3>
                  <p className={`text-lg font-semibold ${result.prediction === 1 ? "text-red-700" : "text-green-700"
                    }`}>
                    Probability: {(result.probability * 100).toFixed(1)}%
                  </p>
                  <p className={`text-sm mt-3 ${result.prediction === 1 ? "text-red-600" : "text-green-600"
                    }`}>
                    {result.prediction === 1
                      ? "Higher cardiovascular risk detected. Consult a healthcare professional."
                      : "Lower cardiovascular risk. Maintain a healthy lifestyle."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      {/* <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gray-900 text-white p-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Activity className="w-5 h-5" /> Technical Specifications
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              <div className="p-6 space-y-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Algorithm</div>
                  <div className="font-mono font-bold text-gray-900">
                    XGBoost Classifier
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Training Data
                  </div>
                  <div className="font-mono font-bold text-gray-900">
                    70,000 samples
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Features</div>
                  <div className="font-mono font-bold text-gray-900">
                    11 input variables
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Accuracy</div>
                  <div className="font-mono font-bold text-green-600">
                    73.97%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    ROC-AUC Score
                  </div>
                  <div className="font-mono font-bold text-blue-600">0.805</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Libraries Used
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">
                      NumPy
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">
                      Pandas
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">
                      Scikit-learn
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">
                      XGBoost
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Prediction Workflow. Our model follows a rigorous 4-step process
              to deliver accurate cardiovascular disease risk assessments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "Data Input",
                desc: "Patient health metrics are collected including age, blood pressure, cholesterol levels, glucose values, and lifestyle-related factors",
              },
              {
                step: "02",
                title: "Preprocessing",
                desc: "Input data is cleaned, encoded, scaled, and validated using standard preprocessing techniques to ensure consistency and model readiness",
              },
              {
                step: "03",
                title: "ML Algorithm",
                desc: "A machine learning model built using scikit-learn algorithms processes the input features through a trained prediction pipeline",
              },
              {
                step: "04",
                title: "Risk Prediction",
                desc: "The trained model outputs cardiovascular disease risk probability along with interpretable prediction confidence",
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-gray-100 absolute -top-8 -left-4 -z-10">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prediction Form Section */}
      <section id="prediction-form" className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-blue-600 p-6 text-white text-center">
              <h2 className="text-2xl font-bold">Get Your Prediction</h2>
              <p className="text-blue-100">
                Enter your health metrics below for an instant assessment
              </p>
            </div>
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-gray-900 bg-gray-50 transition-colors"
                      >
                        <option>Female</option>
                        <option>Male</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age (years)</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        min="10"
                        max="100"
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-gray-900 bg-gray-50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        min="50"
                        max="250"
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-gray-900 bg-gray-50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        min="30"
                        max="200"
                        step="0.1"
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-gray-900 bg-gray-50 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Vitals */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Medical Vitals</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Systolic BP (ap_hi)</label>
                      <input
                        type="number"
                        name="ap_hi"
                        value={formData.ap_hi}
                        onChange={handleChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-gray-900 bg-gray-50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Diastolic BP (ap_lo)</label>
                      <input
                        type="number"
                        name="ap_lo"
                        value={formData.ap_lo}
                        onChange={handleChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-gray-900 bg-gray-50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cholesterol</label>
                      <select
                        name="cholesterol"
                        value={formData.cholesterol}
                        onChange={handleChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-gray-900 bg-gray-50 transition-colors"
                      >
                        <option>Low</option>
                        <option>Normal</option>
                        <option>High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Glucose</label>
                      <select
                        name="glucose"
                        value={formData.glucose}
                        onChange={handleChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-gray-900 bg-gray-50 transition-colors"
                      >
                        <option>Low</option>
                        <option>Normal</option>
                        <option>High</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Lifestyle */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Lifestyle Factors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Smoker?</label>
                      <div className="flex gap-4">
                        <label className="relative flex-1 cursor-pointer">
                          <input
                            type="radio"
                            name="smoke"
                            value="No"
                            checked={formData.smoke === "No"}
                            onChange={handleChange}
                            className="peer sr-only"
                          />
                          <div className="p-3 text-center rounded-lg border border-gray-200 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 hover:bg-gray-50 transition-all">
                            No
                          </div>
                        </label>
                        <label className="relative flex-1 cursor-pointer">
                          <input
                            type="radio"
                            name="smoke"
                            value="Yes"
                            checked={formData.smoke === "Yes"}
                            onChange={handleChange}
                            className="peer sr-only"
                          />
                          <div className="p-3 text-center rounded-lg border border-gray-200 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 hover:bg-gray-50 transition-all">
                            Yes
                          </div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Alcohol Intake?</label>
                      <div className="flex gap-4">
                        <label className="relative flex-1 cursor-pointer">
                          <input
                            type="radio"
                            name="alco"
                            value="No"
                            checked={formData.alco === "No"}
                            onChange={handleChange}
                            className="peer sr-only"
                          />
                          <div className="p-3 text-center rounded-lg border border-gray-200 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 hover:bg-gray-50 transition-all">
                            No
                          </div>
                        </label>
                        <label className="relative flex-1 cursor-pointer">
                          <input
                            type="radio"
                            name="alco"
                            value="Yes"
                            checked={formData.alco === "Yes"}
                            onChange={handleChange}
                            className="peer sr-only"
                          />
                          <div className="p-3 text-center rounded-lg border border-gray-200 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 hover:bg-gray-50 transition-all">
                            Yes
                          </div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Physical Activity?</label>
                      <div className="flex gap-4">
                        <label className="relative flex-1 cursor-pointer">
                          <input
                            type="radio"
                            name="active"
                            value="Sedentary"
                            checked={formData.active === "Sedentary"}
                            onChange={handleChange}
                            className="peer sr-only"
                          />
                          <div className="p-3 text-center rounded-lg border border-gray-200 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 hover:bg-gray-50 transition-all">
                            No
                          </div>
                        </label>
                        <label className="relative flex-1 cursor-pointer">
                          <input
                            type="radio"
                            name="active"
                            value="Active"
                            checked={formData.active === "Active"}
                            onChange={handleChange}
                            className="peer sr-only"
                          />
                          <div className="p-3 text-center rounded-lg border border-gray-200 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 hover:bg-gray-50 transition-all">
                            Yes
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Model Selection */}
                <div className="pt-4 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Selected Model</label>
                  <select
                    name="model_name"
                    value={formData.model_name}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-gray-900 bg-gray-50 transition-colors"
                  >
                    <option>XGBoost</option>
                    <option>Random Forest</option>
                    <option>Logistic Regression</option>
                    <option>CatBoost</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Select the machine learning algorithm for your prediction.</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative group overflow-hidden py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Health Data...
                    </span>
                  ) : "Analyze Health Risk"}
                </button>
              </form>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {error}
                </div>
              )}

              {result && (
                <div
                  className={`mt-8 p-6 rounded-xl text-center border-2 ${result.prediction === 1
                    ? "bg-red-50 border-red-200 text-red-800"
                    : "bg-green-50 border-green-200 text-green-800"
                    }`}
                >
                  <div className="flex justify-center mb-4">
                    {result.prediction === 1 ? (
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <Activity className="w-8 h-8 text-red-600" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <Heart className="w-8 h-8 text-green-600" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-3xl font-bold mb-2">
                    Result: {result.risk} Risk
                  </h3>
                  <p className="text-xl opacity-90">
                    Probability: {(result.probability * 100).toFixed(1)}%
                  </p>
                  <p className="mt-4 text-sm opacity-75 max-w-md mx-auto">
                    {result.prediction === 1
                      ? "The model suggests a higher likelihood of cardiovascular issues. Please consult a healthcare professional."
                      : "The model suggests a lower likelihood of cardiovascular issues. Maintain a healthy lifestyle!"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Performance Metrics
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Model Analytics & Insights. Comprehensive visualization of model
              performance, training metrics, and feature importance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Accuracy Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <BarChartIcon className="w-5 h-5 text-blue-600" /> Model
                Accuracy Comparison
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={metrics}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                      }}
                    />
                    <Bar
                      dataKey="accuracy"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      name="Accuracy (%)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ROC Curve */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" /> ROC Curve (AUC =
                0.805)
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={rocData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="x"
                      type="number"
                      domain={[0, 1]}
                      label={{
                        value: "False Positive Rate",
                        position: "insideBottom",
                        offset: -5,
                      }}
                    />
                    <YAxis
                      dataKey="y"
                      type="number"
                      domain={[0, 1]}
                      label={{
                        value: "True Positive Rate",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="y"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="x"
                      stroke="#9ca3af"
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Confusion Matrix */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" /> Confusion Matrix
              </h3>
              <div className="grid grid-cols-2 gap-4 h-80">
                <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center justify-center text-center border border-green-100">
                  <div className="text-3xl font-bold text-green-700">
                    {detailedMetrics
                      ? detailedMetrics.confusion_matrix.tn
                      : "5454"}
                  </div>
                  <div className="text-sm font-medium text-green-800">
                    True Negative
                  </div>
                  <div className="text-xs text-green-600">
                    (Correct: No Disease)
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg flex flex-col items-center justify-center text-center border border-red-100">
                  <div className="text-3xl font-bold text-red-700">
                    {detailedMetrics
                      ? detailedMetrics.confusion_matrix.fp
                      : "1550"}
                  </div>
                  <div className="text-sm font-medium text-red-800">
                    False Positive
                  </div>
                  <div className="text-xs text-red-600">
                    (Error: Predicted Disease)
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg flex flex-col items-center justify-center text-center border border-red-100">
                  <div className="text-3xl font-bold text-red-700">
                    {detailedMetrics
                      ? detailedMetrics.confusion_matrix.fn
                      : "2093"}
                  </div>
                  <div className="text-sm font-medium text-red-800">
                    False Negative
                  </div>
                  <div className="text-xs text-red-600">
                    (Error: Missed Disease)
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center justify-center text-center border border-green-100">
                  <div className="text-3xl font-bold text-green-700">
                    {detailedMetrics
                      ? detailedMetrics.confusion_matrix.tp
                      : "4903"}
                  </div>
                  <div className="text-sm font-medium text-green-800">
                    True Positive
                  </div>
                  <div className="text-xs text-green-600">
                    (Correct: Disease)
                  </div>
                </div>
              </div>
              <div className="text-center mt-4 text-sm text-gray-500">
                Total Predictions:{" "}
                {detailedMetrics
                  ? detailedMetrics.confusion_matrix.tn +
                  detailedMetrics.confusion_matrix.fp +
                  detailedMetrics.confusion_matrix.fn +
                  detailedMetrics.confusion_matrix.tp
                  : "14,000"}{" "}
                | Accuracy:{" "}
                {detailedMetrics
                  ? (detailedMetrics.accuracy * 100).toFixed(2) + "%"
                  : "73.97%"}
              </div>
            </div>

            {/* Feature Importance */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <BarChartIcon className="w-5 h-5 text-blue-600" /> Feature
                Importance
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={featureImportance}
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill="#3b82f6"
                      radius={[0, 4, 4, 0]}
                      name="Importance (%)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mt-12">
            <div className="bg-blue-50 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-blue-700 mb-1">
                {detailedMetrics
                  ? (detailedMetrics.accuracy * 100).toFixed(2) + "%"
                  : "73.97%"}
              </div>
              <div className="text-sm text-blue-600 font-medium">Accuracy</div>
            </div>
            <div className="bg-green-50 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-green-700 mb-1">
                {detailedMetrics
                  ? (detailedMetrics.precision * 100).toFixed(2) + "%"
                  : "75.98%"}
              </div>
              <div className="text-sm text-green-600 font-medium">
                Precision
              </div>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-purple-700 mb-1">
                {detailedMetrics
                  ? (detailedMetrics.recall * 100).toFixed(2) + "%"
                  : "70.08%"}
              </div>
              <div className="text-sm text-purple-600 font-medium">Recall</div>
            </div>
            <div className="bg-orange-50 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-orange-700 mb-1">
                {detailedMetrics
                  ? detailedMetrics.f1_score.toFixed(2)
                  : "0.73"}
              </div>
              <div className="text-sm text-orange-600 font-medium">
                F1-Score
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-white text-xl font-bold mb-4">
                CardioPredict AI
              </h3>
              <p className="max-w-md">
                An academic machine learning project for cardiovascular disease
                prediction using scikit-learn models and a complete end-to-end
                ML pipeline.
              </p>
            </div>
            <div className="md:text-right">
              <h3 className="text-white text-xl font-bold mb-4">
                Project Details
              </h3>
              <ul className="space-y-2">
                <li>Phase 5: Backend & Deployment</li>
                <li>Dataset: Kaggle CVD Dataset</li>
                <li>Framework: Next.js + FastAPI</li>
                <li>Libraries: NumPy, Pandas, Matplotlib, Scikit-learn</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            © 2025 CardioPredict AI. Academic Project - For Educational Purposes
            Only.
          </div>
        </div>
      </footer>
    </main>
  );
}
