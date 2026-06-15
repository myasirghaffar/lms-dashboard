import React from "react";
import { BellRing, FileText, MessageCircle, ReceiptText } from "lucide-react";

const ActionItem = ({ icon: Icon, label, description, color }: any) => (
    <div className="group rounded-2xl p-6 text-white shadow-lg transition-all hover:-translate-y-1" style={{ backgroundColor: color }}>
        <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 transition-transform group-hover:scale-105">
            <Icon size={28} />
        </div>
        <span className="text-xl font-black">{label}</span>
        <p className="mt-3 text-sm leading-6 text-white/80">{description}</p>
    </div>
);

const ActionGrid = () => {
    return (
        <section className="bg-white py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.24em] text-school-green">Digital school services</p>
                        <h2 className="mt-3 max-w-2xl text-3xl font-black text-school-blue md:text-4xl">
                            Faster workflows for staff, students, and parents.
                        </h2>
                    </div>
                    <p className="max-w-md text-sm leading-6 text-gray-600">The home page now highlights the core LMS services that make the school easier to manage every day.</p>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                    <ActionItem icon={FileText} label="Results" description="Exam records, marksheets, and class performance summaries." color="#0A4087" />
                    <ActionItem icon={ReceiptText} label="Fees" description="Fee slips, dues, payments, and student account history." color="#379962" />
                    <ActionItem icon={BellRing} label="Notices" description="School announcements, event updates, and parent reminders." color="#92257B" />
                    <ActionItem icon={MessageCircle} label="Support" description="Office contact, parent queries, and teacher communication." color="#0A4087" />
                </div>
            </div>
        </section>
    );
};

export default ActionGrid;
