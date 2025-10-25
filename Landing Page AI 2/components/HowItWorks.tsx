import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { MessageSquare, Bot, Wrench, ArrowRight } from "lucide-react";

interface HowItWorksProps {
  onStartNow: () => void;
}

export function HowItWorks({ onStartNow }: HowItWorksProps) {
  const steps = [
    {
      icon: MessageSquare,
      title: "Describe your project",
      description: "Upload photos or describe your issue — 'Mini-split won't cool' or 'Kitchen remodel under $15k'.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Bot,
      title: "AI Agents do the work",
      description: "Our Fetch-powered agents scrape, analyze, and match licensed professionals.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Wrench,
      title: "Get matched pros instantly",
      description: "Receive ranked contractors with license info, service radius, and transparent pricing.",
      color: "from-cyan-500 to-cyan-600",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl mb-4">
            From idea to qualified pro in 60 seconds
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="relative p-8 h-full hover:shadow-xl transition-shadow duration-300 border-2 border-gray-100">
                {/* Arrow between cards */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-blue-600" />
                  </div>
                )}

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            onClick={onStartNow}
          >
            Start Now
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
