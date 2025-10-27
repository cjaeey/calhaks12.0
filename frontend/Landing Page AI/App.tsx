import { useState } from "react";
import { Hero } from "./src/components/Hero";
import { HowItWorks } from "./src/components/HowItWorks";
import { AIShowcase } from "./src/components/AIShowcase";
import { FeaturedTrades } from "./src/components/FeaturedTrades";
import { IntakeForm } from "./src/components/IntakeForm";
import { CTASection } from "./src/components/CTASection";
import { Footer } from "./src/components/Footer";
import { PostProjectModal } from "./src/components/PostProjectModal";

export default function App() {
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
