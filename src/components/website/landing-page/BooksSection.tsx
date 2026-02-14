import React from "react";
import Image from "next/image";

const BooksSection = () => {
    const books = [
        { name: "Urdu", color: "#92257B" },
        { name: "English", color: "#0A4087" },
        { name: "Science", color: "#379962" },
        { name: "Math", color: "#92257B" },
        { name: "Islamiyat", color: "#0A4087" },
    ];

    return (
        <section className="py-20 bg-[#0A4087] text-white relative overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#92257B] rounded-full blur-[100px] opacity-20 -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#379962] rounded-full blur-[100px] opacity-10 -ml-32 -mb-32" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <h2 className="text-3xl font-extrabold mb-4 uppercase tracking-wide">
                    AMS Talwandi Books
                </h2>
                <p className="text-blue-200 mb-12">Books developed with efficient and effective techniques.</p>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {books.map((book, index) => (
                        <div key={index} className="group cursor-pointer">
                            <div className={`aspect-[3/4] rounded-lg shadow-xl mb-4 overflow-hidden relative transition-transform duration-300 group-hover:-translate-y-4 group-hover:rotate-2 border-4 border-white`} style={{ backgroundColor: book.color }}>
                                <div className="absolute inset-0 flex items-center justify-center p-4">
                                    <div className="text-center">
                                        <div className="w-12 h-1 bg-white mx-auto mb-2" />
                                        <span className="font-bold text-white uppercase text-sm tracking-tighter">{book.name}</span>
                                        <div className="w-12 h-1 bg-white mx-auto mt-2" />
                                    </div>
                                </div>
                                {/* Book Spine Shadow */}
                                <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/10" />
                            </div>
                            <p className="font-bold text-sm uppercase opacity-80 group-hover:opacity-100 transition-opacity">Level {index + 1}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BooksSection;
