"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BarChart, Info, Home, Menu, X } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    const navLinks = [
        { href: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
        { href: "/predict", label: "Predict", icon: <Activity className="w-4 h-4" /> },
        { href: "/analysis", label: "Analysis", icon: <BarChart className="w-4 h-4" /> },
        { href: "/about", label: "About", icon: <Info className="w-4 h-4" /> },
    ];

    return (
        <nav className="bg-white/70 border-b-2 border-purple-100 sticky top-0 z-50 backdrop-blur-xl">
            <div className="container mx-auto px-4">
                <div className="flex h-20 items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 text-purple-900 font-black text-2xl hover:opacity-80 transition-all group">
                        <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform">
                            <Activity className="w-6 h-6" />
                        </div>
                        <span className="tracking-tight">CardioPredict <span className="text-purple-600">AI</span></span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-2 text-sm font-bold tracking-wide transition-all ${isActive(link.href) ? "text-purple-600" : "text-slate-600 hover:text-purple-600"
                                    }`}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/predict"
                            className="hidden sm:flex px-6 py-2.5 bg-purple-600 text-white rounded-2xl text-sm font-black hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-0.5"
                        >
                            Start Now
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-slate-600 hover:text-purple-600 transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b-2 border-purple-100 shadow-xl animate-fade-in-down">
                    <div className="flex flex-col p-6 gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-4 p-4 rounded-2xl text-base font-bold transition-all ${isActive(link.href)
                                    ? "bg-purple-50 text-purple-600"
                                    : "text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/predict"
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full mt-4 px-6 py-4 bg-purple-600 text-white rounded-2xl text-center font-black shadow-lg shadow-purple-100"
                        >
                            Start Analysis Now
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
