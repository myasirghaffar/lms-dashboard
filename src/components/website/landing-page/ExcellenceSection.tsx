import React from "react";
import Image from "next/image";
import { CheckCircle2, Play } from "lucide-react";

const ExcellenceSection = () => {
    const points = [
        "Qualified teachers with weekly lesson planning",
        "Regular tests, result tracking, and parent feedback",
        "Islamic values, manners, discipline, and confidence",
        "Digital records for attendance, fees, classes, and exams",
    ];

    return (
        <section className="bg-white py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
                    <div>
                        <div className="mb-6 flex items-center gap-3">
                            <Image
                                src="/images/logo/logo.svg"
                                alt="AMS Talwandi Logo"
                                width={72}
                                height={72}
                                className="h-16 w-16 rounded-full object-contain"
                            />
                            <div>
                                <p className="text-sm font-black uppercase tracking-[0.24em] text-school-magenta">Why choose us</p>
                                <p className="font-bold text-school-green">Inspired by excellence and innovation</p>
                            </div>
                        </div>
                        <h2 className="text-3xl font-black leading-tight text-school-blue md:text-5xl">
                            A school where learning, values, and management work together.
                        </h2>
                        <p className="mt-6 text-base leading-8 text-gray-600">
                            AMS Talwandi High School is designed for the full school journey: classroom teaching, assessment, co-curricular activities, student care, and reliable communication with parents.
                        </p>
                        <div className="mt-8 grid gap-4 sm:grid-cols-2">
                            {points.map((point) => (
                                <div key={point} className="flex gap-3 rounded-2xl bg-school-paper p-4">
                                    <CheckCircle2 className="mt-0.5 shrink-0 text-school-green" size={20} />
                                    <p className="text-sm font-semibold leading-6 text-school-ink">{point}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-[2rem] shadow-2xl shadow-school-blue/15">
                        <Image
                            src="/images/grid-image/image-04.png"
                            alt="AMS Talwandi classroom"
                            width={600}
                            height={400}
                            className="h-[460px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-school-blue-deep/20 transition-colors group-hover:bg-school-blue-deep/35">
                            <div className="rounded-full bg-school-magenta p-6 text-white shadow-xl">
                                <Play fill="white" size={32} />
                            </div>
                        </div>
                        <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/92 p-5 backdrop-blur">
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-school-magenta">Campus life</p>
                            <p className="mt-2 text-xl font-black text-school-blue">Structured classrooms, confident students, connected parents.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExcellenceSection;
