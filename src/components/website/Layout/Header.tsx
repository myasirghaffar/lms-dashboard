"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Facebook, Twitter, Instagram, Youtube, Menu, X } from "lucide-react";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Campus", href: "/campus" },
        { name: "Curriculum", href: "/curriculum" },
        { name: "Admission", href: "/admission" },
        { name: "Resources", href: "/resources" },
        { name: "News", href: "/news" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <header className="w-full">
            {/* Top Bar */}
            <div className="bg-[#0A4087] text-white py-2 px-4 md:px-8 hidden md:flex justify-between items-center text-xs">
                <div className="flex gap-4">
                    <span className="cursor-pointer hover:text-yellow-300 transition-colors">SMS Portal</span>
                    <span className="cursor-pointer hover:text-yellow-300 transition-colors">Online Admission</span>
                    <Link href="/signin" className="hover:text-yellow-300 transition-colors font-semibold">CMS Login</Link>
                    <Link href="/signin" className="hover:text-yellow-300 transition-colors font-semibold">Staff Login</Link>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <Facebook size={14} className="cursor-pointer hover:text-yellow-300" />
                        <Twitter size={14} className="cursor-pointer hover:text-yellow-300" />
                        <Instagram size={14} className="cursor-pointer hover:text-yellow-300" />
                        <Youtube size={14} className="cursor-pointer hover:text-yellow-300" />
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="bg-white shadow-md border-b-4 border-[#92257B]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/">
                                <Image
                                    src="/images/logo/logo.svg"
                                    alt="AMS Talwandi Logo"
                                    width={180}
                                    height={60}
                                    className="h-16 w-auto"
                                />
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-[#0A4087] font-bold hover:text-[#92257B] transition-colors uppercase text-sm"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="text-[#0A4087] cursor-pointer hover:text-[#92257B]">
                                <Search size={20} />
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-[#0A4087] p-2"
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100 pb-4 shadow-lg">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="block px-3 py-2 text-[#0A4087] font-bold hover:bg-gray-50 hover:text-[#92257B] transition-colors uppercase text-sm"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
