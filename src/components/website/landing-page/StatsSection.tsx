import React from "react";
import { Users, BookOpen, GraduationCap, School } from "lucide-react";

const StatItem = ({ icon: Icon, value, label }: any) => (
    <div className="flex flex-col items-center text-center space-y-2 border-r border-white/20 last:border-0 px-8">
        <Icon size={48} className="text-white opacity-80 mb-2" />
        <span className="text-4xl font-extrabold text-white">{value}</span>
        <span className="text-xs font-bold text-white/70 uppercase tracking-widest">{label}</span>
    </div>
);

const StatsSection = () => {
    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-fixed bg-center"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop')` }}
            />
            <div className="absolute inset-0 bg-[#0A4087]/90 mix-blend-multiply" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <h2 className="text-3xl font-extrabold text-white mb-2 uppercase tracking-wide">
                    AMS Talwandi Schools – Progress Dashboard
                </h2>
                <p className="text-white/80 mb-16 italic">34 Years of Excellence & Experience</p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatItem icon={Users} value="300,000" label="Success Student of AMS Talwandi schools" />
                    <StatItem icon={BookOpen} value="50" label="Published by Gohar Publications" />
                    <StatItem icon={GraduationCap} value="14,500" label="TEACHERS Working in all campuses" />
                    <StatItem icon={School} value="700" label="CAMPUSES School Branches all over country" />
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
