import { Button } from "./ui/button";
import { motion } from "motion/react";
import { Rocket, UserPlus } from "lucide-react";

interface CTASectionProps {
  onPostProject: () => void;
}

export function CTASection({ onPostProject }: CTASectionProps) {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with Blueprint Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700" />
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-5xl text-white mb-6">
            Start your next project today.
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of homeowners and professionals building better together
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-900 hover:bg-gray-100 px-8"
              onClick={onPostProject}
            >
              <Rocket className="w-5 h-5 mr-2" />
              Post a Project
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Join as a Professional
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
