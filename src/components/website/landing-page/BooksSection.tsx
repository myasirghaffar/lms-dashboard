"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BooksSection = () => {
    const books = [
        { name: "Urdu", color: "#92257B", level: "Level 1", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" },
        { name: "English", color: "#0A4087", level: "Level 2", image: "https://images.unsplash.com/photo-1543004629-ff56ec21d484?q=80&w=800&auto=format&fit=crop" },
        { name: "Science", color: "#379962", level: "Level 3", image: "https://images.unsplash.com/photo-1532012197367-9b597de7d3d5?q=80&w=800&auto=format&fit=crop" },
        { name: "Math", color: "#92257B", level: "Level 4", image: "https://images.unsplash.com/photo-1509062522246-373b1d5911d8?q=80&w=800&auto=format&fit=crop" },
        { name: "Islamiyat", color: "#0A4087", level: "Level 5", image: "https://images.unsplash.com/photo-1585779034823-7e9ac8faec70?q=80&w=800&auto=format&fit=crop" },
        { name: "History", color: "#379962", level: "Level 6", image: "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?q=80&w=800&auto=format&fit=crop" },
        { name: "Geography", color: "#92257B", level: "Level 7", image: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=800&auto=format&fit=crop" },
    ];

    return (
        <section className="py-20 bg-[#0A4087] text-white relative overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#92257B] rounded-full blur-[120px] opacity-20 -mr-40 -mt-40 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#379962] rounded-full blur-[120px] opacity-10 -ml-40 -mb-40 animate-pulse" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter">
                        AMS TALWANDI BOOKS
                    </h2>
                    <div className="w-24 h-1.5 bg-[#92257B] mx-auto mb-6 rounded-full" />
                    <p className="text-blue-200 text-lg max-w-2xl mx-auto font-medium">
                        Curriculum developed with efficient and effective pedagogical techniques,
                        tailored for modern learning environments.
                    </p>
                </div>

                <div className="carouselFour">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        loop={true}
                        speed={12000}
                        autoplay={{
                            delay: 0,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        pagination={false}
                        navigation={false}
                        allowTouchMove={true}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 4 },
                            1280: { slidesPerView: 5 },
                        }}
                        className="!pb-24 !px-4 !overflow-visible"
                    >
                        {books.map((book, index) => (
                            <SwiperSlide key={index}>
                                <div className="group cursor-pointer" style={{ perspective: '1200px' }}>
                                    <div className="relative aspect-[3/4.5] rounded-l-md rounded-r-xl overflow-hidden shadow-2xl transition-all duration-700 ease-out group-hover:[transform:rotateY(-25deg)_translateX(15px)_translateZ(20px)] border-l-[12px] border-white/10 group-hover:border-white/20">
                                        <Image
                                            src={book.image}
                                            alt={book.name}
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />

                                        {/* Book Spine Texture */}
                                        <div className="absolute inset-y-0 left-0 w-[12px] bg-black/40 z-20 backdrop-blur-[2px] shadow-[inset_-3px_0_8px_rgba(0,0,0,0.6)]" />

                                        {/* Premium Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10 opacity-80 group-hover:opacity-60 transition-opacity" />

                                        <div className="absolute inset-x-0 bottom-0 z-20 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                            <div className="mb-3">
                                                <span className="inline-block px-2.5 py-1 rounded bg-[#92257B] text-[10px] font-black uppercase tracking-widest text-white mb-2 shadow-lg">
                                                    {book.level}
                                                </span>
                                                <h3 className="text-2xl font-black text-white leading-[0.9] uppercase italic tracking-tighter">
                                                    {book.name}
                                                </h3>
                                            </div>
                                            <div className="w-0 group-hover:w-full h-1 bg-white/40 transition-all duration-700 delay-100" />
                                        </div>

                                        {/* Page Edges Highlight */}
                                        <div className="absolute right-0 inset-y-1 w-1.5 bg-gradient-to-l from-white/30 to-transparent z-20 rounded-r-full" />

                                        {/* Surface Shine */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    </div>

                                    <div className="mt-8 text-center transition-all duration-500 transform translate-y-6 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
                                        <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Academic Series</p>
                                        <button className="bg-white text-[#0A4087] hover:bg-[#92257B] hover:text-white px-8 py-2.5 rounded-full text-xs font-black uppercase transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 active:translate-y-0">
                                            View Content
                                        </button>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            {/* Custom Carousel Styles for this specific section */}
            <style jsx>{`
                :global(.carouselFour .swiper-wrapper) {
                    transition-timing-function: linear !important;
                }
                :global(.carouselFour .swiper-button-next),
                :global(.carouselFour .swiper-button-prev) {
                    background: white !important;
                    color: #0A4087 !important;
                    width: 50px !important;
                    height: 50px !important;
                    border-radius: 50% !important;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.3) !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                :global(.carouselFour .swiper-button-next:hover),
                :global(.carouselFour .swiper-button-prev:hover) {
                    background: #92257B !important;
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
                    background: #92257B !important;
                    width: 35px !important;
                    border-radius: 5px !important;
                }
            `}</style>
        </section>
    );
};

export default BooksSection;

