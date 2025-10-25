import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Network, Zap, CheckCircle2 } from "lucide-react";

interface HeroProps {
  onFindProfessional: () => void;
  onPostProject: () => void;
}

export function Hero({ onFindProfessional, onPostProject }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#2563EB] opacity-95" />
      
      {/* Animated Network Background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl lg:text-6xl mb-6">
              Smarter hiring for your next project.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-300 mb-8 max-w-xl"
          >
            ReNOVA connects homeowners and builders to licensed pros — HVAC, electrical,
            plumbing, remodels, and more — using AI that understands your job and matches you instantly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              onClick={onFindProfessional}
            >
              Find a Professional
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-900"
              onClick={onPostProject}
            >
              Post a Project
            </Button>
          </motion.div>

          {/* Trust Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="border-t border-gray-600 pt-6"
          >
            <p className="text-sm text-gray-400 mb-3">Powered by</p>
            <div className="flex flex-wrap gap-6 text-sm text-gray-300">
              <span>Fetch.ai</span>
              <span>•</span>
              <span>Anthropic</span>
              <span>•</span>
              <span>Bright Data</span>
              <span>•</span>
              <span>ChromaDB</span>
              <span>•</span>
              <span>Cal Hacks 12.0</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - 3D Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative hidden lg:block"
        >
          {/* Central Hub */}
          <div className="relative w-full h-[500px] flex items-center justify-center">
            {/* AI Core */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl"
            >
              <Network className="w-16 h-16 text-white" />
            </motion.div>

            {/* Orbiting Elements */}
            {[
              { icon: CheckCircle2, angle: 0, delay: 0, label: "Customer" },
              { icon: Zap, angle: 120, delay: 0.5, label: "AI" },
              { icon: CheckCircle2, angle: 240, delay: 1, label: "Contractor" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="absolute"
                animate={{
                  rotate: [item.angle, item.angle + 360],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear",
                  delay: item.delay,
                }}
                style={{
                  width: "280px",
                  height: "280px",
                }}
              >
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-cyan-400 rounded-full flex items-center justify-center shadow-lg"
                  animate={{
                    rotate: [0, -360],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                    delay: item.delay,
                  }}
                >
                  <item.icon className="w-10 h-10 text-blue-900" />
                </motion.div>
              </motion.div>
            ))}

            {/* Connection Lines */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-px bg-gradient-to-b from-cyan-400/50 to-transparent"
                style={{
                  height: "140px",
                  left: "50%",
                  top: "50%",
                  transformOrigin: "top center",
                  rotate: `${i * 60}deg`,
                }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
