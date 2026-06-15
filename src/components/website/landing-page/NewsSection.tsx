import React from "react";
import Image from "next/image";
import Link from "next/link";

const NewsCard = ({ image, title, date, excerpt, tag }: any) => (
    <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-school-blue/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-school-blue/10">
        <div className="relative h-56 overflow-hidden">
            <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute left-4 top-4 rounded-full bg-school-gold px-3 py-1 text-xs font-black uppercase tracking-wide text-school-blue-deep">{tag}</div>
        </div>
        <div className="flex flex-grow flex-col p-6">
            <span className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-school-magenta">{date}</span>
            <h3 className="mb-3 text-xl font-black leading-tight text-school-blue transition-colors group-hover:text-school-magenta">
                {title}
            </h3>
            <p className="mb-5 flex-grow text-sm leading-6 text-gray-600">
                {excerpt}
            </p>
            <Link href="/news" className="text-sm font-black text-school-green hover:text-school-magenta">
                Read update
            </Link>
        </div>
    </div>
);

const NewsSection = () => {
    const news = [
        {
            image: "/images/cards/card-01.jpg",
            title: "New academic session orientation for parents",
            date: "March 15, 2026",
            tag: "Admissions",
            excerpt: "Parents are invited to meet class teachers, review academic expectations, and understand the LMS communication flow.",
        },
        {
            image: "/images/cards/card-02.jpg",
            title: "Science activity week brings practical learning to class",
            date: "April 8, 2026",
            tag: "Campus",
            excerpt: "Students will participate in models, observation tasks, and classroom demonstrations to strengthen concept clarity.",
        },
        {
            image: "/images/cards/card-03.jpg",
            title: "Monthly test schedule published for all classes",
            date: "May 2, 2026",
            tag: "Exams",
            excerpt: "Class-wise tests, subjects, and result timelines are available so students and parents can prepare in advance.",
        },
    ];

    return (
        <section className="bg-school-paper py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.24em] text-school-magenta">Latest updates</p>
                        <h2 className="mt-3 text-3xl font-black text-school-blue md:text-4xl">
                            News from AMS Talwandi High School.
                        </h2>
                    </div>
                    <p className="max-w-md text-sm leading-6 text-gray-600">
                        Keep families informed with admission updates, academic schedules, events, and campus activities.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {news.map((item, index) => (
                        <NewsCard key={index} {...item} />
                    ))}
                </div>

                <div className="mt-12 flex justify-center">
                    <Link href="/news" className="rounded-full bg-school-magenta px-8 py-3 text-sm font-black text-white transition-colors hover:bg-school-magenta-deep">
                        View All News
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default NewsSection;
