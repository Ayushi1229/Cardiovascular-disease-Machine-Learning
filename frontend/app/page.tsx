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
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-800/50 border border-blue-700 rounded-full px-4 py-1 mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-blue-100">
                AI Model Online
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              CardioPredict AI
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Advanced cardiovascular disease risk assessment powered by machine
              learning
            </p>
            <p className="text-lg text-blue-200 mb-12 max-w-3xl mx-auto">
              Our AI model analyzes multiple health factors to provide accurate
              cardiovascular disease risk predictions, helping healthcare
              professionals make informed decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                onClick={scrollToPrediction}
                className="px-8 py-4 bg-white text-blue-900 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Get Prediction <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-blue-800/50 border border-blue-700 text-white rounded-lg font-bold text-lg hover:bg-blue-800 transition-all flex items-center justify-center gap-2">
                Learn More
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto border-t border-blue-800/50 pt-12">
              <div className="text-center">
                <div className="text-4xl font-bold mb-1">
                  {detailedMetrics
                    ? (detailedMetrics.accuracy * 100).toFixed(2) + "%"
                    : "73.97%"}
                </div>
                <div className="text-blue-300 text-sm uppercase tracking-wider">
                  Accuracy
                </div>
              </div>
              <div className="text-center border-l border-r border-blue-800/50">
                <div className="text-4xl font-bold mb-1">70K</div>
                <div className="text-blue-300 text-sm uppercase tracking-wider">
                  Data Points
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-1">
                  {detailedMetrics
                    ? detailedMetrics.roc_auc.toFixed(3)
                    : "0.805"}
                </div>
                <div className="text-blue-300 text-sm uppercase tracking-wider">
                  ROC-AUC
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Disclaimer */}
      <section className="bg-amber-50 border-b border-amber-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-start gap-4 max-w-4xl mx-auto">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-amber-800 mb-1">
                Medical Disclaimer
              </h3>
              <p className="text-amber-700 text-sm mb-2">
                Important: This AI model is designed for educational and
                research purposes only. It should NOT be used as a substitute
                for professional medical advice, diagnosis, or treatment.
              </p>
              <ul className="text-amber-700 text-sm list-disc list-inside space-y-1">
                <li>Always seek the advice of qualified healthcare providers</li>
                <li>
                  Never disregard professional medical advice based on this
                  prediction
                </li>
                <li>This tool is part of an ML/DL academic project</li>
                <li>Results should be validated by medical professionals</li>
              </ul>
              <p className="text-amber-700 text-xs mt-2 italic">
                By using this tool, you acknowledge that you understand and
                accept these limitations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Model Information */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Model Information
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Powered by Advanced Machine Learning. Our prediction model
              leverages well-established machine learning algorithms from
              scikit-learn as part of an academic ML/DL project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">
                Sklearn-Based ML Model
              </h3>
              <p className="text-gray-600 text-sm">
                Built using proven machine learning algorithms from
                scikit-learn, focusing on proper feature engineering and
                evaluation.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">
                Kaggle Cardiovascular Dataset
              </h3>
              <p className="text-gray-600 text-sm">
                Trained on 70,000 patient records from the Cardiovascular
                Disease Dataset, ensuring reliable learning.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">
                Reliable Performance
              </h3>
              <p className="text-gray-600 text-sm">
                Achieves strong predictive performance with high accuracy and
                ROC-AUC score, validated through systematic testing.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">
                Real-time Inference
              </h3>
              <p className="text-gray-600 text-sm">
                Fast cardiovascular risk prediction using optimized sklearn
                pipelines integrated with a real-time backend API.
              </p>
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border text-gray-900 bg-gray-50"
                    >
                      <option>Female</option>
                      <option>Male</option>
                    </select>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age (years)
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      min="10"
                      max="100"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border text-gray-900 bg-gray-50"
                    />
                  </div>

                  {/* Height */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      min="50"
                      max="250"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border text-gray-900 bg-gray-50"
                    />
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      min="30"
                      max="200"
                      step="0.1"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border text-gray-900 bg-gray-50"
                    />
                  </div>

                  {/* Systolic BP */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Systolic BP (ap_hi)
                    </label>
                    <input
                      type="number"
                      name="ap_hi"
                      value={formData.ap_hi}
                      onChange={handleChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border text-gray-900 bg-gray-50"
                    />
                  </div>

                  {/* Diastolic BP */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Diastolic BP (ap_lo)
                    </label>
                    <input
                      type="number"
                      name="ap_lo"
                      value={formData.ap_lo}
                      onChange={handleChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border text-gray-900 bg-gray-50"
                    />
                  </div>

                  {/* Cholesterol */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cholesterol
                    </label>
                    <select
                      name="cholesterol"
                      value={formData.cholesterol}
                      onChange={handleChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border text-gray-900 bg-gray-50"
                    >
                      <option>Low</option>
                      <option>Normal</option>
                      <option>High</option>
                    </select>
                  </div>

                  {/* Glucose */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Glucose
                    </label>
                    <select
                      name="glucose"
                      value={formData.glucose}
                      onChange={handleChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border text-gray-900 bg-gray-50"
                    >
                      <option>Low</option>
                      <option>Normal</option>
                      <option>High</option>
                    </select>
                  </div>

                  {/* Smoke */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Smoker?
                    </label>
                    <div className="flex gap-4 mt-2">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="smoke"
                          value="No"
                          checked={formData.smoke === "No"}
                          onChange={handleChange}
                          className="form-radio text-blue-600 w-4 h-4"
                        />
                        <span className="ml-2 text-gray-900">No</span>
                      </label>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="smoke"
                          value="Yes"
                          checked={formData.smoke === "Yes"}
                          onChange={handleChange}
                          className="form-radio text-blue-600 w-4 h-4"
                        />
                        <span className="ml-2 text-gray-900">Yes</span>
                      </label>
                    </div>
                  </div>

                  {/* Alcohol */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alcohol Intake?
                    </label>
                    <div className="flex gap-4 mt-2">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="alco"
                          value="No"
                          checked={formData.alco === "No"}
                          onChange={handleChange}
                          className="form-radio text-blue-600 w-4 h-4"
                        />
                        <span className="ml-2 text-gray-900">No</span>
                      </label>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="alco"
                          value="Yes"
                          checked={formData.alco === "Yes"}
                          onChange={handleChange}
                          className="form-radio text-blue-600 w-4 h-4"
                        />
                        <span className="ml-2 text-gray-900">Yes</span>
                      </label>
                    </div>
                  </div>

                  {/* Active */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Physical Activity?
                    </label>
                    <div className="flex gap-4 mt-2">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="active"
                          value="Sedentary"
                          checked={formData.active === "Sedentary"}
                          onChange={handleChange}
                          className="form-radio text-blue-600 w-4 h-4"
                        />
                        <span className="ml-2 text-gray-900">Sedentary</span>
                      </label>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="active"
                          value="Active"
                          checked={formData.active === "Active"}
                          onChange={handleChange}
                          className="form-radio text-blue-600 w-4 h-4"
                        />
                        <span className="ml-2 text-gray-900">Active</span>
                      </label>
                    </div>
                  </div>

                  {/* Model Selection */}
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Model
                    </label>
                    <select
                      name="model_name"
                      value={formData.model_name}
                      onChange={handleChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border text-gray-900 bg-gray-50"
                    >
                      <option>XGBoost</option>
                      <option>Random Forest</option>
                      <option>Logistic Regression</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors"
                >
                  {loading ? "Analyzing..." : "Analyze Risk"}
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
                  className={`mt-8 p-6 rounded-xl text-center border-2 ${
                    result.prediction === 1
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
