"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Menu, Phone, Search, X, Youtube } from "lucide-react";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Academics", href: "/about" },
        { name: "Admissions", href: "/contact" },
        { name: "Campuses", href: "/about" },
        { name: "News", href: "/news" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full">
            <div className="bg-school-blue-deep text-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[11px] font-semibold sm:px-6 lg:px-8">
                    <div className="flex min-w-0 items-center gap-4">
                        <span className="hidden items-center gap-1.5 md:flex">
                            <MapPin size={13} className="text-school-gold" />
                            Talwandi, District Kasur
                        </span>
                        <a href="tel:+923431166632" className="flex items-center gap-1.5 hover:text-school-gold">
                            <Phone size={13} className="text-school-gold" />
                            +92 343 1166632
                        </a>
                        <a href="mailto:info@amstalwandi.edu.pk" className="hidden items-center gap-1.5 hover:text-school-gold sm:flex">
                            <Mail size={13} className="text-school-gold" />
                            info@amstalwandi.edu.pk
                        </a>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/login" className="rounded-full bg-white/10 px-3 py-1 hover:bg-school-gold hover:text-school-blue-deep">
                            LMS Login
                        </Link>
                        <Facebook size={14} className="hidden cursor-pointer hover:text-school-gold sm:block" />
                        <Instagram size={14} className="hidden cursor-pointer hover:text-school-gold sm:block" />
                        <Youtube size={14} className="hidden cursor-pointer hover:text-school-gold sm:block" />
                    </div>
                </div>
            </div>

            <nav className="border-b border-school-blue/10 bg-white/95 shadow-sm backdrop-blur">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        <div className="flex min-w-0 flex-shrink-0 items-center">
                            <Link href="/" className="flex items-center gap-3">
                                <Image
                                    src="/images/logo/logo.svg"
                                    alt="AMS Talwandi Logo"
                                    width={84}
                                    height={84}
                                    className="h-16 w-16 rounded-full object-contain"
                                />
                                <span className="hidden leading-tight sm:block">
                                    <span className="block text-base font-black uppercase tracking-wide text-school-blue">AMS Talwandi</span>
                                    <span className="block text-xs font-bold uppercase tracking-[0.28em] text-school-magenta">High School</span>
                                </span>
                            </Link>
                        </div>

                        <div className="hidden items-center gap-7 lg:flex">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm font-bold text-school-ink transition-colors hover:text-school-magenta"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <button aria-label="Search" className="rounded-full border border-school-blue/15 p-2 text-school-blue hover:border-school-magenta hover:text-school-magenta">
                                <Search size={18} />
                            </button>
                            <Link href="/contact" className="rounded-full bg-school-magenta px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-school-magenta-deep">
                                Apply Now
                            </Link>
                        </div>

                        <div className="flex items-center lg:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label="Toggle menu"
                                className="rounded-lg border border-school-blue/15 p-2 text-school-blue"
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="border-t border-school-blue/10 bg-white pb-4 shadow-lg lg:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="block rounded-lg px-3 py-2 text-sm font-bold text-school-blue transition-colors hover:bg-school-paper hover:text-school-magenta"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                href="/login"
                                className="mt-2 block rounded-lg bg-school-blue px-3 py-2 text-sm font-bold text-white"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                LMS Login
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
