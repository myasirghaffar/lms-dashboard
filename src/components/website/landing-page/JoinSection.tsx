import React from "react";
import { ArrowRight } from "lucide-react";

const JoinSection = () => {
    return (
        <section className="bg-school-blue py-24 text-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:items-center">
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-school-gold">Admission enquiry</p>
                    <h2 className="mt-3 text-3xl font-black md:text-5xl">
                        Give your child a school experience parents can trust.
                    </h2>
                    <p className="mt-5 leading-8 text-white/75">
                        Share basic details and the school office can guide you about class availability, admission requirements, fee structure, and campus visit timing.
                    </p>
                </div>

                <form className="grid gap-4 rounded-3xl border border-white/15 bg-white p-5 shadow-2xl shadow-black/15 md:grid-cols-2">
                    <input
                        type="text"
                        placeholder="Student name"
                        className="rounded-2xl border border-school-blue/10 bg-school-paper px-4 py-3 text-school-ink outline-none focus:border-school-magenta"
                    />
                    <input
                        type="text"
                        placeholder="Class applying for"
                        className="rounded-2xl border border-school-blue/10 bg-school-paper px-4 py-3 text-school-ink outline-none focus:border-school-magenta"
                    />
                    <input
                        type="tel"
                        placeholder="Parent phone"
                        className="rounded-2xl border border-school-blue/10 bg-school-paper px-4 py-3 text-school-ink outline-none focus:border-school-magenta"
                    />
                    <input
                        type="text"
                        placeholder="Area / village"
                        className="rounded-2xl border border-school-blue/10 bg-school-paper px-4 py-3 text-school-ink outline-none focus:border-school-magenta"
                    />
                    <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-school-magenta px-8 py-3 font-black text-white transition-colors hover:bg-school-magenta-deep md:col-span-2">
                        Request Admission Call
                        <ArrowRight size={18} />
                    </button>
                </form>
            </div>
        </section>
    );
};

export default JoinSection;
