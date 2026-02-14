"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
    {
        image: "/images/carousel/images.jpg",
        title: "A LIFE CHANGING APPROACH TO LEARNING",
        subtitle: "EVERY CHILD IS",
        highlight: "SMART",
    },
    {
        image: "/images/carousel/images (1).jpg",
        title: "EMPOWERING FUTURE GENERATIONS",
        subtitle: "BUILDING TOMORROW'S",
        highlight: "LEADERS",
    },
    {
        image: "/images/carousel/images (2).jpg",
        title: "INNOVATIVE & QUALITY EDUCATION",
        subtitle: "EXCELLENCE IN",
        highlight: "EVERYTHING",
    }
];

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const nextSlide = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setTimeout(() => setIsAnimating(false), 500);
    }, [isAnimating]);

    const prevSlide = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    return (
        <section className="relative h-[450px] md:h-[650px] overflow-hidden bg-gray-900">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    {/* Background Image with Zoom Effect */}
                    <div
                        className={`absolute inset-0 bg-cover bg-center transition-transform duration-[5000ms] ease-linear ${index === currentSlide ? "scale-110" : "scale-100"
                            }`}
                        style={{ backgroundImage: `url('${slide.image}')` }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

                    {/* Content */}
                    <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                        <div className={`md:w-2/3 space-y-6 transition-all duration-700 delay-300 ${index === currentSlide ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
                            }`}>
                            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-lg">
                                {slide.title}
                            </h1>
                            <p className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider flex items-center gap-3">
                                {slide.subtitle} <span className="text-[#92257B] bg-white px-4 py-1 rounded-sm shadow-lg">{slide.highlight}</span>
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                {["EXPLORE >>", "COGNIZE >>", "PRACTICE >>", "APPRECIATE"].map((text, i) => (
                                    <span
                                        key={i}
                                        className="text-white font-bold text-sm tracking-widest border-b-4 border-[#92257B] pb-1 hover:text-[#92257B] hover:border-white transition-all cursor-pointer"
                                    >
                                        {text}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Floating Logo / Graphic Element */}
                        <div className={`hidden md:block absolute right-8 top-1/2 -translate-y-1/2 transition-all duration-1000 delay-500 ${index === currentSlide ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
                            }`}>
                            <div className="relative p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl">

                                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white">
                                    <Image
                                        src={slide.image}
                                        alt="Slide"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="absolute -top-4 -right-4 bg-[#92257B] p-0 rounded-full overflow-hidden shadow-xl animate-bounce">
                                    <Image src="/images/logo/logo.svg" alt="Brand" width={100} height={40} className="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-[#92257B] text-white p-3 rounded-full backdrop-blur-sm transition-all group hidden md:block"
            >
                <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-[#92257B] text-white p-3 rounded-full backdrop-blur-sm transition-all group hidden md:block"
            >
                <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Pagination Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-4">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`transition-all duration-300 rounded-full ${index === currentSlide
                            ? "w-12 h-3 bg-[#92257B]"
                            : "w-3 h-3 bg-white/50 hover:bg-white"
                            }`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroSection;
