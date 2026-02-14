import React from "react";
import Image from "next/image";
import { Play } from "lucide-react";

const ExcellenceSection = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="mb-12">
                    <Image
                        src="/images/logo/logo.svg"
                        alt="Logo"
                        width={80}
                        height={80}
                        className="mx-auto mb-4"
                    />
                    <h2 className="text-3xl font-extrabold text-[#0A4087] mb-2 uppercase tracking-wide">
                        Inspired by Excellence & Innovation
                    </h2>
                    <p className="text-gray-500">We offer a wide range of high quality of learning and extra-curricular activities.</p>
                    <div className="w-40 h-1 bg-[#92257B] mx-auto mt-4" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="text-left space-y-6">
                        <h3 className="text-2xl font-bold text-[#0A4087] uppercase">Why Choose AMS Talwandi Schools?</h3>
                        <p className="text-gray-600 leading-relaxed">
                            We offer a unique combination of religious and contemporary education. Our focus is on character building and academic excellence. With state-of-the-art facilities and experienced educators, we ensure every child reaches their full potential.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Our curriculum is designed to foster critical thinking, creativity, and a strong sense of social responsibility. We believe in providing a holistic education that prepares students for the challenges of the modern world.
                        </p>
                    </div>

                    <div className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-2xl">
                        <Image
                            src="https://images.unsplash.com/photo-1577896851231-70ef18881757?q=80&w=2070&auto=format&fit=crop"
                            alt="School Campus"
                            width={600}
                            height={400}
                            className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <div className="bg-[#92257B] p-6 rounded-full text-white shadow-xl animate-pulse">
                                <Play fill="white" size={32} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExcellenceSection;
