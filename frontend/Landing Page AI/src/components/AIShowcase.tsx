import { motion } from "framer-motion";
import { ArrowRight, Database, Brain, Search, Users } from "lucide-react";

export function AIShowcase() {
  const agents = [
    {
      icon: Users,
      name: "Fetch.ai uAgents",
      description: "Coordinate your job request",
      color: "bg-blue-500",
    },
    {
      icon: Search,
      name: "Bright Data",
      description: "Scrape verified contractor portfolios",
      color: "bg-purple-500",
    },
    {
      icon: Brain,
      name: "Claude by Anthropic",
      description: "Understand your scope",
      color: "bg-cyan-500",
    },
    {
      icon: Database,
      name: "ChromaDB",
      description: "Find the best match with vector search",
      color: "bg-orange-500",
    },
  ];

  return (
    <section className="py-24 bg-[#0F172A] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl mb-4">
            Powered by multi-agent AI
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A sophisticated network of AI agents working together to find you the perfect match
          </p>
        </motion.div>

        {/* Flow Diagram */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {agents.map((agent, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Connecting Arrow */}
                {index < agents.length - 1 && (
                  <div className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 w-6 z-0">
                    <ArrowRight className="w-6 h-6 text-cyan-400" />
                  </div>
                )}

                {/* Agent Card */}
                <div className="bg-[#1E293B] rounded-xl p-6 border border-gray-700 hover:border-cyan-400 transition-all duration-300 h-full">
                  <div className={`${agent.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <agent.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg mb-2">{agent.name}</h3>
                  <p className="text-sm text-gray-400">{agent.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Process Flow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 p-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl border border-blue-500/30"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div className="flex-1">
                <h4 className="text-xl mb-2">Request</h4>
                <p className="text-gray-400 text-sm">You describe your project needs</p>
              </div>
              <ArrowRight className="w-8 h-8 text-cyan-400 rotate-90 md:rotate-0" />
              <div className="flex-1">
                <h4 className="text-xl mb-2">Analysis</h4>
                <p className="text-gray-400 text-sm">AI agents process and match</p>
              </div>
              <ArrowRight className="w-8 h-8 text-cyan-400 rotate-90 md:rotate-0" />
              <div className="flex-1">
                <h4 className="text-xl mb-2">Results</h4>
                <p className="text-gray-400 text-sm">Qualified pros with bids</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
