import React from "react";
import { MapPin } from "lucide-react";

const NearbySection = () => {
    return (
        <div className="bg-[#379962] py-6 px-4">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-white font-bold text-center md:text-left text-lg md:text-xl max-w-2xl">
                    AMS Talwandi Schools extend its unique learning experience to well over 2000+ students in 2+ branches in District Kasur across Pakistan.             </p>
                <button className="bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-md flex items-center gap-2 transition-colors uppercase shadow-lg">
                    <MapPin size={20} />
                    Find Us Nearby
                </button>
            </div>
        </div>
    );
};

export default NearbySection;
