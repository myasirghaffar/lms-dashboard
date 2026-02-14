import React from "react";
import { User, Users, GraduationCap, Palette } from "lucide-react";

const FeatureItem = ({ icon: Icon, title, description }: any) => (
    <div className="flex flex-col items-center text-center space-y-4">
        <div className="bg-gray-100 p-6 rounded-2xl text-[#0A4087] hover:bg-[#92257B] hover:text-white transition-all duration-300 cursor-pointer shadow-inner">
            <Icon size={40} />
        </div>
        <h3 className="font-bold text-[#0A4087] uppercase text-sm tracking-wide">{title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
            {description}
        </p>
    </div>
);

const FeaturesSection = () => {
    const features = [
        {
            icon: User,
            title: "Personality Development",
            description: "The modern approach of personality development like ethics and social responsibility.",
        },
        {
            icon: Users,
            title: "Teacher Training",
            description: "Regular training of teachers to keep them updated with modern teaching techniques.",
        },
        {
            icon: GraduationCap,
            title: "Hifz Quran & Career",
            description: "Specialized Hifz Quran program along with regular school subjects for career growth.",
        },
        {
            icon: Palette,
            title: "Co-Curricular Activities",
            description: "Field trips, art competitions, sports, and other activities for holistic growth.",
        },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-[#0A4087] uppercase tracking-wide mb-4">
                        Salient Features of AMS Talwandi Schools
                    </h2>
                    <p className="text-gray-500">Our mission is to achieve the goals for the world & hereafter.</p>
                    <div className="w-20 h-1 bg-[#379962] mx-auto mt-4" />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                    {features.map((feature, index) => (
                        <FeatureItem key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
