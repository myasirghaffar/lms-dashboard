import React from "react";

const JoinSection = () => {
    return (
        <section className="py-20 bg-[#0A4087] text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-extrabold mb-4 uppercase tracking-wide">
                    Join Over <span className="text-yellow-300">200,000 Students</span> Enjoying AMS Talwandi School Now
                </h2>
                <p className="text-yellow-300 mb-12 font-bold">Become a Part of AMS Talwandi schools Network near Your Homes.</p>

                <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Name"
                        className="bg-white text-gray-900 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#92257B]"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="bg-white text-gray-900 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#92257B]"
                    />
                    <input
                        type="tel"
                        placeholder="Phone"
                        className="bg-white text-gray-900 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#92257B]"
                    />
                    <button className="bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded transition-colors uppercase shadow-lg">
                        Sign Up
                    </button>
                </form>
            </div>
        </section>
    );
};

export default JoinSection;
