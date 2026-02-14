import HeroSection from "@/components/website/landing-page/HeroSection";
import NearbySection from "@/components/website/landing-page/NearbySection";
import InfoGrid from "@/components/website/landing-page/InfoGrid";
import ExcellenceSection from "@/components/website/landing-page/ExcellenceSection";
import NewsSection from "@/components/website/landing-page/NewsSection";
import BooksSection from "@/components/website/landing-page/BooksSection";
import FeaturesSection from "@/components/website/landing-page/FeaturesSection";
import StatsSection from "@/components/website/landing-page/StatsSection";
import ActionGrid from "@/components/website/landing-page/ActionGrid";
import JoinSection from "@/components/website/landing-page/JoinSection";
import LogosSection from "@/components/website/landing-page/LogosSection";

export const metadata = {
    title: "AMS Talwandi Schools | A Life Changing Approach to Learning",
    description: "Official website of AMS Talwandi Schools, providing quality education with Islamic values.",
};

export default function LandingPage() {
    return (
        <>
            <HeroSection />
            <NearbySection />
            <InfoGrid />
            <ExcellenceSection />
            <NewsSection />
            <BooksSection />
            <FeaturesSection />
            <StatsSection />
            <ActionGrid />
            <JoinSection />
            <LogosSection />
        </>
    );
}
