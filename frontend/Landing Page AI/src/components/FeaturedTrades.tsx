import { Card } from "./ui/card";
import { motion } from "framer-motion";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight } from "lucide-react";

export function FeaturedTrades() {
  const trades = [
    {
      name: "Interior Design",
      image: "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcmlvciUyMGRlc2lnbiUyMG1vZGVybnxlbnwxfHx8fDE3NjEzODY4NjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      featured: true,
    },
    {
      name: "HVAC",
      image: "https://images.unsplash.com/photo-1751486289950-5c4898a4c773?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIVkFDJTIwc3lzdGVtJTIwaW5zdGFsbGF0aW9ufGVufDF8fHx8MTc2MTQxNDgwOHww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Electrical",
      image: "https://images.unsplash.com/photo-1754620906571-9ba64bd3ffb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2lhbiUyMHdpcmluZ3xlbnwxfHx8fDE3NjE0MTQ4MDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Plumbing",
      image: "https://images.unsplash.com/photo-1686936393675-e86518c535a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHVtYmVyJTIwcGlwZXN8ZW58MXx8fHwxNzYxNDE0ODA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Roofing",
      image: "https://images.unsplash.com/photo-1655103878427-dc3ecbb792c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb29maW5nJTIwY29uc3RydWN0aW9ufGVufDF8fHx8MTc2MTMxNDUzOHww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Remodeling",
      image: "https://images.unsplash.com/photo-1632214533040-eb166a3b172d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwcmVtb2RlbGluZyUyMGludGVyaW9yfGVufDF8fHx8MTc2MTQxNDgwOXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Flooring",
      image: "https://images.unsplash.com/photo-1693948568453-a3564f179a84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vcmluZyUyMGluc3RhbGxhdGlvbiUyMHdvb2R8ZW58MXx8fHwxNzYxNDE0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Landscaping",
      image: "https://images.unsplash.com/photo-1521446652717-278e3f3f7353?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5kc2NhcGluZyUyMGdhcmRlbiUyMGRlc2lnbnxlbnwxfHx8fDE3NjE0MTQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Handyman",
      image: "https://images.unsplash.com/photo-1584677191047-38f48d0db64e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5keW1hbiUyMHRvb2xzJTIwcmVwYWlyfGVufDF8fHx8MTc2MTMzODA0MXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl mb-4">
            Every trade, every project, everywhere.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trades.map((trade, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className={`group overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 ${trade.featured ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-100'} hover:border-blue-500`}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  {trade.featured && (
                    <div className="absolute top-4 right-4 z-10 bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
                      Main Demo
                    </div>
                  )}
                  <ImageWithFallback
                    src={trade.image}
                    alt={trade.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Trade Name */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl text-white mb-2">{trade.name}</h3>
                    <div className="flex items-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm">Get matched pros</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
