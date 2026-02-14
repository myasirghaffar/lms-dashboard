import React from "react";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Youtube, Heart } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[#0A4087] text-white pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* About Column */}
                    <div className="space-y-4">
                        <Image
                            src="/images/logo/logo.svg"
                            alt="AMS Talwandi Logo"
                            width={160}
                            height={50}
                            className="h-12 w-auto"
                        />
                        <p className="text-sm text-gray-300">
                            AMS Talwandi Schools provide a unique learning experience to students across Pakistan, combining modern education with Islamic values.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-yellow-300 font-bold mb-4 uppercase">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><a href="#" className="hover:text-[#92257B] transition-colors">Our Vision & Mission</a></li>
                            <li><a href="#" className="hover:text-[#92257B] transition-colors">Admission Policy</a></li>
                            <li><a href="#" className="hover:text-[#92257B] transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-[#92257B] transition-colors">Franchise Inquiry</a></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-yellow-300 font-bold mb-4 uppercase">Resources</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><a href="#" className="hover:text-[#92257B] transition-colors">Parent Portal</a></li>
                            <li><a href="#" className="hover:text-[#92257B] transition-colors">Student Downloads</a></li>
                            <li><a href="#" className="hover:text-[#92257B] transition-colors">E-Books</a></li>
                            <li><a href="#" className="hover:text-[#92257B] transition-colors">Media Gallery</a></li>
                        </ul>
                    </div>

                    {/* Social / Contact */}
                    <div>
                        <h3 className="text-yellow-300 font-bold mb-4 uppercase">Stay Connected</h3>
                        <div className="flex space-x-4 mb-6">
                            <Facebook className="cursor-pointer hover:text-[#92257B]" />
                            <Twitter className="cursor-pointer hover:text-[#92257B]" />
                            <Instagram className="cursor-pointer hover:text-[#92257B]" />
                            <Youtube className="cursor-pointer hover:text-[#92257B]" />
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            Email: info@AMS Talwandi.edu.pk<br />
                            UAN: +92 42 111 327 727
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-[#92257B]/30 pt-6 mt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 space-y-4 md:space-y-0">
                    <div>
                        © {new Date().getFullYear()} AMS Talwandi Schools | All rights reserved.
                    </div>
                    <div className="flex items-center gap-1">
                        Made with <Heart size={12} className="text-[#92257B] fill-[#92257B]" /> by Yasir Ghaffar (03431166632)
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
