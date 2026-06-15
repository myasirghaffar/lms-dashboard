import React from "react";
import { BarChart3, CalendarDays, ClipboardList, ShieldCheck } from "lucide-react";

const LogosSection = () => {
    const systems = [
        { icon: ClipboardList, title: "Attendance", text: "Daily class records" },
        { icon: BarChart3, title: "Results", text: "Marks and progress" },
        { icon: CalendarDays, title: "Calendar", text: "Events and exams" },
        { icon: ShieldCheck, title: "Security", text: "Role based access" },
    ];

    return (
        <section className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid gap-4 rounded-3xl border border-school-blue/10 bg-school-paper p-4 md:grid-cols-4">
                    {systems.map(({ icon: Icon, title, text }) => (
                        <div key={title} className="flex items-center gap-4 rounded-2xl bg-white p-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-school-blue text-white">
                                <Icon size={24} />
                            </div>
                            <div>
                                <p className="font-black text-school-ink">{title}</p>
                                <p className="text-sm text-gray-500">{text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LogosSection;
