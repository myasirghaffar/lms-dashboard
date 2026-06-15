import React from "react";
import { Brain, HeartHandshake, Medal, Microscope, Palette, UserRoundCheck } from "lucide-react";

const FeatureItem = ({ icon: Icon, title, description }: any) => (
    <div className="rounded-2xl border border-school-blue/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-school-blue/10">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-school-blue text-white">
            <Icon size={28} />
        </div>
        <h3 className="mb-3 text-lg font-black text-school-ink">{title}</h3>
        <p className="text-sm leading-6 text-gray-600">
            {description}
        </p>
    </div>
);

const FeaturesSection = () => {
    const features = [
        {
            icon: Brain,
            title: "Concept Based Learning",
            description: "Lessons are planned around understanding, practice, revision, and skill confidence.",
        },
        {
            icon: UserRoundCheck,
            title: "Personality Development",
            description: "Students learn presentation, manners, teamwork, punctuality, and personal responsibility.",
        },
        {
            icon: HeartHandshake,
            title: "Teacher Training",
            description: "Teachers follow a consistent academic plan and improve through observation and feedback.",
        },
        {
            icon: Microscope,
            title: "Science & Computer Lab",
            description: "Practical activities help students connect theory with observation and digital skills.",
        },
        {
            icon: Palette,
            title: "Co-Curricular Activities",
            description: "Sports, arts, speeches, quizzes, and events build confidence beyond textbooks.",
        },
        {
            icon: Medal,
            title: "Assessment Culture",
            description: "Frequent tests and result analysis help teachers intervene before students fall behind.",
        },
    ];

    return (
        <section className="bg-school-paper py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto mb-14 max-w-3xl text-center">
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-school-magenta">Salient features</p>
                    <h2 className="mt-3 text-3xl font-black text-school-blue md:text-4xl">
                        Built for academic results and student confidence.
                    </h2>
                    <p className="mt-4 text-gray-600">Our mission is to prepare students for the world ahead while keeping faith, manners, and discipline at the center.</p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <FeatureItem key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
