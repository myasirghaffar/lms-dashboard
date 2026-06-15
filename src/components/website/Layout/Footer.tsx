import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-school-blue-deep text-white pt-14 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-4 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/images/logo/logo.svg"
                                alt="AMS Talwandi Logo"
                                width={72}
                                height={72}
                                className="h-14 w-14 rounded-full bg-white object-contain"
                            />
                            <div>
                                <p className="font-black uppercase tracking-wide">AMS Talwandi</p>
                                <p className="text-xs font-bold uppercase tracking-[0.24em] text-school-gold">High School</p>
                            </div>
                        </div>
                        <p className="text-sm leading-6 text-white/70">
                            A modern school system for Talwandi families, combining strong academics, Islamic values, disciplined routines, and parent-connected learning.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-school-gold font-bold mb-4 uppercase">School</h3>
                        <ul className="space-y-2 text-sm text-white/70">
                            <li><Link href="/about" className="hover:text-white">About AMS Talwandi</Link></li>
                            <li><Link href="/contact" className="hover:text-white">Admissions</Link></li>
                            <li><Link href="/news" className="hover:text-white">News & Events</Link></li>
                            <li><Link href="/login" className="hover:text-white">LMS Portal</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-school-gold font-bold mb-4 uppercase">Learning</h3>
                        <ul className="space-y-2 text-sm text-white/70">
                            <li><Link href="/news" className="hover:text-white">Academic Calendar</Link></li>
                            <li><Link href="/login" className="hover:text-white">Exam & Results</Link></li>
                            <li><Link href="/login" className="hover:text-white">Fee Information</Link></li>
                            <li><Link href="/login" className="hover:text-white">Student Resources</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-school-gold font-bold mb-4 uppercase">Contact</h3>
                        <div className="space-y-3 text-sm text-white/70">
                            <p className="flex gap-2"><MapPin size={16} className="mt-0.5 text-school-green" />Talwandi, District Kasur, Punjab</p>
                            <p className="flex gap-2"><Phone size={16} className="mt-0.5 text-school-green" />+92 343 1166632</p>
                            <p className="flex gap-2"><Mail size={16} className="mt-0.5 text-school-green" />info@amstalwandi.edu.pk</p>
                        </div>
                        <div className="mt-6 flex space-x-3">
                            {[Facebook, Instagram, Youtube].map((Icon, index) => (
                                <span key={index} className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-school-magenta">
                                    <Icon size={18} />
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-6 mt-6 flex flex-col md:flex-row justify-between items-center text-xs text-white/50 space-y-4 md:space-y-0">
                    <div>
                        © {new Date().getFullYear()} AMS Talwandi Schools | All rights reserved.
                    </div>
                    <div>Designed for a connected school, parent, and student experience.</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
