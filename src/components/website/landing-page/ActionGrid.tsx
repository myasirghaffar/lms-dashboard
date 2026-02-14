import React from "react";
import { Camera, Download, Book, PhoneCall } from "lucide-react";

const ActionItem = ({ icon: Icon, label, color }: any) => (
    <div className={`p-10 rounded-xl text-white flex flex-col items-center justify-center space-y-4 cursor-pointer hover:opacity-90 transition-opacity shadow-lg group`} style={{ backgroundColor: color }}>
        <div className="bg-white/20 p-4 rounded-full group-hover:scale-110 transition-transform">
            <Icon size={40} />
        </div>
        <span className="font-bold uppercase tracking-widest text-lg">{label}</span>
    </div>
);

const ActionGrid = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ActionItem icon={Camera} label="Photo / Videos" color="#0A4087" />
                    <ActionItem icon={Download} label="Downloads" color="#379962" />
                    <ActionItem icon={Book} label="Our Books" color="#92257B" />
                    <ActionItem icon={PhoneCall} label="Call / Mail / Chat" color="#0A4087" />
                </div>
            </div>
        </section>
    );
};

export default ActionGrid;
