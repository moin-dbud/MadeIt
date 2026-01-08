import React from "react";
import { Hero } from "../components/Hero";
import { HeroMockup } from "../components/HeroMockup";
import { ProblemSolution } from "../components/ProblemSolution";
import { HowItWorks } from "../components/HowItWorks";
import { Features } from "../components/Feature";
import { FeaturedPortfolios } from "../components/FeaturedPortfolios";
import { WhyMadeIt } from "../components/WhyMadeIt";
import { FinalCTA } from "../components/FinalCTA";
import Footer from "../components/Footer";

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Hero />
            <HeroMockup />
            <ProblemSolution />
            <HowItWorks />
            <Features />
            <FeaturedPortfolios />
            <WhyMadeIt />
            <FinalCTA />
            <Footer />
        </div>
    )
}

export default Home;