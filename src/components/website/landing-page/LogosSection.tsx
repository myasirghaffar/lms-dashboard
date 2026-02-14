import React from "react";
import Image from "next/image";

const LogosSection = () => {
    const logos = [
        { src: "/images/logo/logo.svg", alt: "Logo 1" },
        { src: "/images/logo/logo.svg", alt: "Logo 2" },
        { src: "/images/logo/logo.svg", alt: "Logo 3" },
        { src: "/images/logo/logo.svg", alt: "Logo 4" },
    ];

    return (
        <section className="py-12 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-between gap-8 opacity-60 hover:opacity-100 transition-opacity">
                    {logos.map((logo, index) => (
                        <div key={index} className="grayscale hover:grayscale-0 transition-all duration-300">
                            <Image
                                src={logo.src}
                                alt={logo.alt}
                                width={150}
                                height={60}
                                className="h-12 w-auto"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LogosSection;
