import React from 'react';
import Link from 'next/link';
import { BookOpen, Users, Award, Building2, Phone, Mail, MapPin } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
            {/* Header/Navigation */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
                <nav className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <BookOpen className="h-8 w-8 text-blue-600" />
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">School LMS</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="#about" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition">
                                About
                            </Link>
                            <Link href="#programs" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition">
                                Programs
                            </Link>
                            <Link href="#branches" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition">
                                Branches
                            </Link>
                            <Link href="#contact" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition">
                                Contact
                            </Link>
                            <Link
                                href="/signin"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 md:py-32">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                        Empowering Education Through
                        <span className="text-blue-600"> Innovation</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                        A comprehensive learning management system designed to enhance the educational experience
                        for students, teachers, and parents across all our branches.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/admissions"
                            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg text-lg font-semibold"
                        >
                            Apply for Admission
                        </Link>
                        <Link
                            href="#about"
                            className="px-8 py-4 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition shadow-lg text-lg font-semibold"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section id="about" className="bg-white dark:bg-gray-800 py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Why Choose Us?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                                <Users className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Expert Faculty</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Highly qualified and experienced teachers dedicated to student success.
                            </p>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-600">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                                <Award className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Academic Excellence</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Proven track record of outstanding academic achievements and results.
                            </p>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-600">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
                                <Building2 className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Modern Facilities</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                State-of-the-art infrastructure and learning resources across all branches.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Academic Programs Section */}
            <section id="programs" className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Academic Programs
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {['Primary School', 'Middle School', 'High School', 'Advanced Placement'].map((program) => (
                            <div key={program} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{program}</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Comprehensive curriculum designed for holistic development.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Branches Section */}
            <section id="branches" className="bg-white dark:bg-gray-800 py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Our Branches
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: 'Main Campus', location: 'Downtown District', students: '1,200+' },
                            { name: 'North Branch', location: 'North District', students: '800+' },
                            { name: 'South Branch', location: 'South District', students: '950+' },
                        ].map((branch) => (
                            <div key={branch.name} className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl shadow-lg">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{branch.name}</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-1">📍 {branch.location}</p>
                                <p className="text-gray-600 dark:text-gray-300">👥 {branch.students} Students</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Get In Touch
                    </h2>
                    <div className="max-w-2xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-6 text-center">
                            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                                <Phone className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Phone</h3>
                                <p className="text-gray-600 dark:text-gray-300">+1 234 567 8900</p>
                            </div>
                            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                                <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email</h3>
                                <p className="text-gray-600 dark:text-gray-300">info@schoollms.com</p>
                            </div>
                            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                                <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Address</h3>
                                <p className="text-gray-600 dark:text-gray-300">123 Education St.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <BookOpen className="h-6 w-6 text-blue-400" />
                                <span className="text-xl font-bold">School LMS</span>
                            </div>
                            <p className="text-gray-400">
                                Empowering education through innovation and excellence.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="#about" className="hover:text-white transition">About Us</Link></li>
                                <li><Link href="#programs" className="hover:text-white transition">Programs</Link></li>
                                <li><Link href="/admissions" className="hover:text-white transition">Admissions</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Resources</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/signin" className="hover:text-white transition">Student Portal</Link></li>
                                <li><Link href="/signin" className="hover:text-white transition">Teacher Portal</Link></li>
                                <li><Link href="/signin" className="hover:text-white transition">Parent Portal</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Contact</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>+1 234 567 8900</li>
                                <li>info@schoollms.com</li>
                                <li>123 Education Street</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2026 School LMS. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
