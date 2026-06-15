"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, CalendarDays, ChevronLeft, ChevronRight, GraduationCap, MapPin, ShieldCheck, Sparkles, UsersRound } from "lucide-react";

const slides = [
    {
        image: "/images/carousel/carousel-01.png",
        kicker: "Admissions open for the new session",
        title: "A better school day starts with a connected system.",
        description: "AMS Talwandi High School blends academic excellence, Islamic values, modern classrooms, and a connected LMS for parents, teachers, and students.",
    },
    {
        image: "/images/carousel/carousel-02.png",
        kicker: "Character, curriculum, confidence",
        title: "Strong foundations from early years to high school.",
        description: "Structured lesson plans, assessments, attendance, announcements, and student progress tracking keep every child visible and supported.",
    },
    {
        image: "/images/carousel/carousel-03.png",
        kicker: "Talwandi, District Kasur",
        title: "A school community built around families.",
        description: "Parents stay informed, teachers teach with clarity, and leadership gets the data needed to improve daily school operations.",
    }
];

const highlights = [
    { icon: UsersRound, label: "2,000+", caption: "Students" },
    { icon: GraduationCap, label: "80+", caption: "Faculty & staff" },
    { icon: BookOpenCheck, label: "35+", caption: "Subjects tracked" },
    { icon: ShieldCheck, label: "100%", caption: "Values focused" },
];

const quickCards = [
    { icon: CalendarDays, title: "Daily Attendance", value: "Live records" },
    { icon: BookOpenCheck, title: "Assignments", value: "Class wise" },
    { icon: GraduationCap, title: "Results", value: "Term tracking" },
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
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_16%_10%,rgba(246,201,69,0.18),transparent_24%),linear-gradient(135deg,#052b61_0%,#0a4087_46%,#92257b_100%)]">
            <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-school-green/20 blur-3xl" />
            <div className="absolute right-0 top-24 h-52 w-52 rounded-full bg-school-gold/20 blur-3xl" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-school-blue-deep/20 to-transparent" />

            <div className="relative min-h-[1120px] sm:min-h-[1040px] lg:min-h-[790px]">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "z-10 opacity-100" : "z-0 opacity-0"
                            }`}
                        aria-hidden={index !== currentSlide}
                    >
                        <div className="mx-auto flex min-h-[1120px] max-w-7xl items-center px-4 pb-20 pt-14 sm:min-h-[1040px] sm:px-6 sm:pb-20 lg:min-h-[790px] lg:px-8 lg:py-16">
                            <div className={`grid w-full items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 transition-transform duration-1000 ease-out ${index === currentSlide ? "translate-y-0" : "translate-y-4"
                                }`}>
                            <div className="max-w-2xl">
                                <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-school-gold shadow-sm backdrop-blur sm:text-xs">
                                    <span className="h-2 w-2 rounded-full bg-school-green" />
                                    {slide.kicker}
                                </div>
                                <h1 className="text-4xl font-black leading-[1.04] text-white sm:text-5xl lg:text-[64px]">
                                    {slide.title}
                                </h1>
                                <p className="mt-6 max-w-xl text-base leading-8 text-white/82 sm:text-lg">
                                    {slide.description}
                                </p>

                                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                    <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-school-gold px-7 py-3 text-sm font-black text-school-blue-deep shadow-lg shadow-black/20 transition-colors hover:bg-white">
                                        Start Admission
                                        <ArrowRight size={18} />
                                    </Link>
                                    <Link href="/login" className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-3 text-sm font-black text-white transition-colors hover:bg-white hover:text-school-blue">
                                        Open LMS Portal
                                    </Link>
                                </div>

                                <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {highlights.map(({ icon: Icon, label, caption }) => (
                                        <div key={caption} className="rounded-2xl border border-white/60 bg-white p-4 shadow-xl shadow-school-blue-deep/10">
                                            <Icon size={21} className="mb-3 text-school-gold" />
                                            <p className="text-xl font-black text-school-blue">{label}</p>
                                            <p className="mt-1 text-xs font-bold text-gray-500">{caption}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute -left-5 top-12 hidden h-28 w-28 rounded-[2rem] bg-school-gold/25 blur-2xl lg:block" />
                                <div className="relative rounded-[2rem] border border-white/20 bg-white/14 p-3 shadow-2xl shadow-school-blue-deep/25 backdrop-blur md:p-5">
                                    <div className="grid gap-3 sm:grid-cols-[1fr_0.62fr]">
                                        <div className="relative min-h-[360px] overflow-hidden rounded-[1.5rem] bg-school-blue-deep sm:min-h-[440px]">
                                            <Image
                                                src={slide.image}
                                                alt="AMS Talwandi school learning environment"
                                                fill
                                                className="object-cover"
                                                priority={index === 0}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-school-blue-deep/80 via-school-blue/10 to-transparent" />
                                            <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/92 p-5 shadow-xl backdrop-blur">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-school-green text-white">
                                                        <Sparkles size={22} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-school-blue">Modern learning culture</p>
                                                        <p className="text-xs font-semibold text-gray-500">Academics, discipline, and parent visibility</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid gap-3">
                                            <div className="rounded-[1.5rem] bg-white p-5 shadow-xl">
                                                <Image src="/images/logo/logo.svg" alt="AMS Talwandi High School" width={96} height={96} className="mb-4 h-20 w-20 object-contain" />
                                                <p className="text-xs font-black uppercase tracking-[0.2em] text-school-magenta">AMS Talwandi</p>
                                                <p className="mt-2 text-2xl font-black leading-tight text-school-blue">High School System</p>
                                            </div>

                                            {quickCards.map(({ icon: Icon, title, value }) => (
                                                <div key={title} className="flex items-center gap-3 rounded-2xl border border-school-blue/10 bg-white/95 p-4 shadow-lg">
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-school-paper text-school-magenta">
                                                        <Icon size={21} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-school-ink">{title}</p>
                                                        <p className="text-xs font-semibold text-gray-500">{value}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="absolute -bottom-6 left-6 hidden rounded-2xl bg-school-magenta px-5 py-4 text-white shadow-xl sm:block">
                                        <p className="text-3xl font-black">100%</p>
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">School Ready</p>
                                    </div>

                                    <div className="absolute -right-4 top-8 hidden rounded-full bg-white px-4 py-3 text-sm font-black text-school-blue shadow-xl md:flex md:items-center md:gap-2">
                                        <MapPin size={17} className="text-school-green" />
                                        District Kasur
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                ))}
            </div>

            <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="absolute left-6 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-school-magenta md:block"
            >
                <ChevronLeft size={28} />
            </button>
            <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-school-magenta md:block"
            >
                <ChevronRight size={28} />
            </button>

            <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`h-2.5 rounded-full transition-all duration-300 ${index === currentSlide
                            ? "w-10 bg-school-gold"
                            : "w-2.5 bg-white/50 hover:bg-white"
                            }`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroSection;
