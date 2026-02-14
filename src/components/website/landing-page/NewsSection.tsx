import React from "react";
import Image from "next/image";

const NewsCard = ({ image, title, date, excerpt }: any) => (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group">
        <div className="relative h-48 overflow-hidden">
            <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <span className="text-xs font-bold text-[#92257B] uppercase mb-2">{date}</span>
            <h3 className="text-lg font-bold text-[#0A4087] mb-3 group-hover:text-[#92257B] transition-colors line-clamp-2">
                {title}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-grow">
                {excerpt}
            </p>
            <a href="#" className="text-yellow-300 font-bold text-xs hover:underline flex items-center gap-1 uppercase">
                READ MORE {">>"}
            </a>
        </div>
    </div>
);

const NewsSection = () => {
    const news = [
        {
            image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop",
            title: "Exploring the Innovative Education System in Japan",
            date: "Oct 15, 2025",
            excerpt: "Our executive team recently visited Japan to study their vocational education systems and bring back best practices...",
        },
        {
            image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
            title: "The Spirit of Togetherness: Branch Admin Convention 2025",
            date: "Sep 22, 2025",
            excerpt: "A gathering of over 700 branch admins to discuss the future of education and shared values at AMS Talwandi...",
        },
        {
            image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop",
            title: "Director's Principal Convention of South Punjab held at Multan",
            date: "Aug 10, 2025",
            excerpt: "Discussing key educational reforms and regional growth strategies for the Southern Punjab branches...",
        },
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-[#0A4087] uppercase tracking-wide mb-4">
                        AMS Talwandi Latest News
                    </h2>
                    <p className="text-gray-500">Gearing news from all cities for events and students to celebrate activities.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {news.map((item, index) => (
                        <NewsCard key={index} {...item} />
                    ))}
                </div>

                <div className="mt-12 flex justify-center">
                    <button className="bg-[#92257B] text-white font-bold py-2 px-8 rounded hover:bg-[#7a1e67] transition-colors uppercase text-sm">
                        View All News
                    </button>
                </div>
            </div>
        </section>
    );
};

export default NewsSection;
