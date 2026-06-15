import React from "react";
import { ArrowRight, MapPin, PhoneCall } from "lucide-react";

const NearbySection = () => {
    return (
        <section className="bg-school-paper px-4 py-16">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 h-1 w-20 rounded-full bg-school-gold" />
                <div className="grid gap-4 rounded-3xl border border-school-blue/10 bg-white p-6 shadow-xl shadow-school-blue/10 md:grid-cols-[1fr_auto_auto] md:items-center md:p-7">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.24em] text-school-magenta">Serving Talwandi families</p>
                        <p className="mt-2 text-lg font-black text-school-blue md:text-2xl">
                            2+ campuses, 2,000+ learners, one connected school management system.
                        </p>
                    </div>
                    <a href="tel:+923431166632" className="inline-flex items-center justify-center gap-2 rounded-full border border-school-blue/15 px-5 py-3 text-sm font-black text-school-blue transition-colors hover:border-school-magenta hover:text-school-magenta">
                        <PhoneCall size={18} />
                        Call Office
                    </a>
                    <button className="inline-flex items-center justify-center gap-2 rounded-full bg-school-green px-6 py-3 text-sm font-black text-white transition-colors hover:bg-school-green-deep">
                        <MapPin size={20} />
                        Find Campus
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default NearbySection;
