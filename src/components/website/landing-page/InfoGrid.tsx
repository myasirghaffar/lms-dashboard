import React from "react";
import { BookOpen, CalendarCheck, ClipboardCheck, GraduationCap, MonitorCheck } from "lucide-react";

const InfoItem = ({ icon: Icon, title, description, accent }: any) => (
    <div className="group rounded-2xl border border-school-blue/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-school-blue/10">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-white transition-transform group-hover:scale-105" style={{ backgroundColor: accent }}>
            <Icon size={26} />
        </div>
        <h3 className="mb-3 text-lg font-black text-school-ink">{title}</h3>
        <p className="text-sm leading-6 text-gray-600">
            {description}
        </p>
    </div>
);

const InfoGrid = () => {
    const items = [
        {
            icon: ClipboardCheck,
            title: "Transparent Admissions",
            description: "A clear process for enquiries, admission tests, required documents, and class placement.",
            accent: "#92257B",
        },
        {
            icon: GraduationCap,
            title: "Academic Discipline",
            description: "Daily routines, term targets, homework, and assessments are organized for measurable progress.",
            accent: "#0A4087",
        },
        {
            icon: MonitorCheck,
            title: "LMS Connected",
            description: "Attendance, fees, results, announcements, and communication are handled from one dashboard.",
            accent: "#379962",
        },
        {
            icon: BookOpen,
            title: "Balanced Curriculum",
            description: "English, Urdu, science, math, Islamiyat, computer learning, activities, and character building.",
            accent: "#92257B",
        },
        {
            icon: CalendarCheck,
            title: "Parent Updates",
            description: "Parents receive school notices, performance updates, attendance status, and event information.",
            accent: "#0A4087",
        },
    ];

    return (
        <section className="bg-school-paper py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 max-w-3xl">
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-school-green">School system</p>
                    <h2 className="mt-3 text-3xl font-black text-school-blue md:text-4xl">
                        Everything families expect from a professional school.
                    </h2>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-5">
                    {items.map((item, index) => (
                        <InfoItem key={index} {...item} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default InfoGrid;
