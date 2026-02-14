import React from "react";
import { UserPlus, Star, Network, BookOpen, Handshake } from "lucide-react";

const InfoItem = ({ icon: Icon, title, description, color }: any) => (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
        <div className={`p-4 rounded-full mb-6 text-white group-hover:scale-110 transition-transform`} style={{ backgroundColor: color }}>
            <Icon size={32} />
        </div>
        <h3 className="text-xl font-bold text-[#0A4087] mb-4 uppercase">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
            {description}
        </p>
    </div>
);

const InfoGrid = () => {
    const items = [
        {
            icon: UserPlus,
            title: "Admission Procedure",
            description: "Step-by-step guide for new admissions. Find documents needed for primary and secondary school entries.",
            color: "#92257B",
        },
        {
            icon: Star,
            title: "Salient Features",
            description: "What makes us unique. Our focus on Islamic values and modern education excellence sets us apart.",
            color: "#0A4087",
        },
        {
            icon: Network,
            title: "Branch Network",
            description: "Explore our wide network of over 700 branches across 150+ cities in Pakistan.",
            color: "#379962",
        },
        {
            icon: BookOpen,
            title: "Education Curriculum",
            description: "Our comprehensive curriculum designed to provide balanced education for all grades.",
            color: "#92257B",
        },
        {
            icon: Handshake,
            title: "Franchise Offer",
            description: "Become a partner in spreading quality education. Join our growing franchise network.",
            color: "#0A4087",
        },
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {items.map((item, index) => (
                        <InfoItem key={index} {...item} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default InfoGrid;
