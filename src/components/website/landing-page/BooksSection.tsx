"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { BookOpenCheck, Calculator, Globe2, Languages, MonitorCog, PenTool, Sprout } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BooksSection = () => {
    const books = [
        { name: "English", icon: Languages, level: "Language", accent: "#0A4087", cover: "#123f83" },
        { name: "Urdu", icon: PenTool, level: "Expression", accent: "#92257B", cover: "#8a236f" },
        { name: "Mathematics", icon: Calculator, level: "Reasoning", accent: "#379962", cover: "#24764a" },
        { name: "Science", icon: Sprout, level: "Discovery", accent: "#0A4087", cover: "#0b5b8f" },
        { name: "Islamiyat", icon: BookOpenCheck, level: "Values", accent: "#92257B", cover: "#284b7f" },
        { name: "Computer", icon: MonitorCog, level: "Digital", accent: "#379962", cover: "#ffffff" },
        { name: "Social Studies", icon: Globe2, level: "Awareness", accent: "#0A4087", cover: "#294d84" },
    ];

    return (
        <section className="relative overflow-hidden bg-school-blue-deep py-24 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mx-auto mb-14 max-w-3xl text-center">
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-school-gold">Curriculum coverage</p>
                    <h2 className="mt-3 text-3xl font-black md:text-5xl">
                        Subject pathways for every stage of learning.
                    </h2>
                    <p className="mt-5 text-white/72">
                        Textbooks, classwork, homework, quizzes, and exam records are aligned so teachers and parents can see where each student needs support.
                    </p>
                </div>

                <div className="carouselFour">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        loop={true}
                        speed={900}
                        autoplay={{
                            delay: 1600,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        pagination={false}
                        navigation={false}
                        allowTouchMove={true}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1280: { slidesPerView: 4 },
                        }}
                        className="!pb-12 !px-1"
                    >
                        {books.map((book, index) => {
                            const Icon = book.icon;
                            const isLight = book.cover === "#ffffff";

                            return (
                                <SwiperSlide key={index} className="!h-auto">
                                    <div className="group flex h-full py-2 [perspective:1200px]">
                                        <div
                                            className="relative flex h-[430px] w-full overflow-hidden border border-white/15 shadow-2xl shadow-black/20 transition-all duration-500 group-hover:-translate-y-2 group-hover:[transform:rotateY(-7deg)]"
                                            style={{
                                                background: `linear-gradient(145deg, ${book.cover} 0%, ${book.cover} 48%, ${book.accent} 160%)`,
                                            }}
                                        >
                                            <div className="absolute inset-y-0 left-0 w-8 bg-black/22 shadow-[inset_-10px_0_18px_rgba(0,0,0,0.28)]" />
                                            <div className="absolute inset-y-0 left-8 w-px bg-white/18" />
                                            <div className="absolute inset-y-3 right-0 w-2 bg-gradient-to-l from-white/60 to-white/10" />
                                            <div className="absolute -right-14 -top-14 h-40 w-40 bg-white/10 blur-2xl" />
                                            <div className="absolute bottom-0 left-8 right-0 h-28 bg-gradient-to-t from-black/26 to-transparent" />

                                            <div className="relative flex flex-1 flex-col p-8 pl-12">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex h-16 w-16 items-center justify-center text-white shadow-xl" style={{ backgroundColor: book.accent }}>
                                                        <Icon size={32} />
                                                    </div>
                                                    <div className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] ${isLight ? "bg-school-blue text-white" : "bg-white/16 text-white"}`}>
                                                        AMS
                                                    </div>
                                                </div>

                                                <div className="mt-12">
                                                    <p className={`text-xs font-black uppercase tracking-[0.28em] ${isLight ? "text-school-gold" : "text-school-gold"}`}>
                                                        {book.level}
                                                    </p>
                                                    <h3 className={`mt-4 text-3xl font-black leading-tight ${isLight ? "text-school-blue" : "text-white"}`}>
                                                        {book.name}
                                                    </h3>
                                                    <div className="mt-5 h-1 w-14 rounded-full" style={{ backgroundColor: book.accent }} />
                                                </div>

                                                <p className={`mt-8 text-sm font-semibold leading-7 ${isLight ? "text-school-blue/72" : "text-white/78"}`}>
                                                    Class content, homework, exams, and teacher notes organized inside the school workflow.
                                                </p>

                                                <div className="mt-auto pt-8">
                                                    <div className={`flex items-center justify-between border-t pt-4 ${isLight ? "border-school-blue/12 text-school-blue" : "border-white/18 text-white"}`}>
                                                        <span className="text-[11px] font-black uppercase tracking-[0.24em]">Curriculum</span>
                                                        <span className="text-2xl font-black">0{index + 1}</span>
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </div>

            {/* Custom Carousel Styles for this specific section */}
            <style jsx>{`
                :global(.carouselFour .swiper-wrapper) {
                    transition-timing-function: ease !important;
                }
                :global(.carouselFour .swiper-button-next),
                :global(.carouselFour .swiper-button-prev) {
                    background: white !important;
                    color: #0a4087 !important;
                    width: 50px !important;
                    height: 50px !important;
                    border-radius: 50% !important;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.3) !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                :global(.carouselFour .swiper-button-next:hover),
                :global(.carouselFour .swiper-button-prev:hover) {
                    background: #92257b !important;
                    color: white !important;
                    transform: scale(1.1) !important;
                }
                :global(.carouselFour .swiper-button-next:after),
                :global(.carouselFour .swiper-button-prev:after) {
                    font-size: 18px !important;
                    font-weight: 900 !important;
                    display: flex !important;
                }
                :global(.carouselFour .swiper-pagination-bullet) {
                    background: white !important;
                    opacity: 0.2 !important;
                    width: 10px !important;
                    height: 10px !important;
                    transition: all 0.3s ease !important;
                }
                :global(.carouselFour .swiper-pagination-bullet-active) {
                    opacity: 1 !important;
                    background: #f6c945 !important;
                    width: 35px !important;
                    border-radius: 5px !important;
                }
            `}</style>
        </section>
    );
};

export default BooksSection;
