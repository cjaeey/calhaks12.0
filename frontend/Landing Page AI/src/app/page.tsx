'use client';

import { useState } from "react";
import { Hero } from "../components/Hero";
import { HowItWorks } from "../components/HowItWorks";
import { AIShowcase } from "../components/AIShowcase";
import { FeaturedTrades } from "../components/FeaturedTrades";
import { IntakeForm } from "../components/IntakeForm";
import { CTASection } from "../components/CTASection";
import { Footer } from "../components/Footer";
import { PostProjectModal } from "../components/PostProjectModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollToIntakeForm = () => {
    const element = document.getElementById("intake-form");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const openPostProjectModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Hero
        onFindProfessional={scrollToIntakeForm}
        onPostProject={openPostProjectModal}
      />
      <HowItWorks onStartNow={scrollToIntakeForm} />
      <AIShowcase />
      <FeaturedTrades />
      <IntakeForm />
      <CTASection onPostProject={openPostProjectModal} />
      <Footer />

      <PostProjectModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}
