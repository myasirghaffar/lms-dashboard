import React from "react";
import { BookOpen, GraduationCap, School, Users } from "lucide-react";

const StatItem = ({ icon: Icon, value, label }: any) => (
    <div className="rounded-3xl border border-white/15 bg-white/10 p-6 text-left backdrop-blur">
        <Icon size={34} className="mb-5 text-school-gold" />
        <span className="block text-4xl font-black text-white">{value}</span>
        <span className="mt-2 block text-sm font-bold leading-5 text-white/75">{label}</span>
    </div>
);

const StatsSection = () => {
    return (
        <section className="relative overflow-hidden py-24">
            <div
                className="absolute inset-0 bg-cover bg-fixed bg-center"
                style={{ backgroundImage: `url('/images/grid-image/image-01.png')` }}
            />
            <div className="absolute inset-0 bg-school-blue/92" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-school-gold">Progress dashboard</p>
                <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black text-white md:text-5xl">
                    A growing school community with measurable daily progress.
                </h2>
                <p className="mx-auto mt-5 mb-12 max-w-2xl text-white/75">The landing page now mirrors the LMS promise: clear records, strong academics, and visible outcomes.</p>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <StatItem icon={Users} value="2,000+" label="Students learning across AMS Talwandi campuses" />
                    <StatItem icon={BookOpen} value="35+" label="Subjects, resources, and activity tracks" />
                    <StatItem icon={GraduationCap} value="80+" label="Teachers and staff supporting families" />
                    <StatItem icon={School} value="2+" label="Campuses serving Talwandi and nearby areas" />
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
