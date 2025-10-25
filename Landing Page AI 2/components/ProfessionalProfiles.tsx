import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { Star, MapPin, Award, DollarSign, CheckCircle2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProfessionalProfilesProps {
  projectDescription: string;
}

export function ProfessionalProfiles({ projectDescription }: ProfessionalProfilesProps) {
  // Mock professional data based on the project description
  const professionals = [
    {
      id: 1,
      name: "Sarah Martinez",
      title: "Interior Designer & Space Planner",
      rating: 4.9,
      reviews: 127,
      location: "San Francisco, CA",
      radius: "25 miles",
      yearsExperience: 12,
      licenseNumber: "CA-ID-45821",
      specialties: ["Residential", "Modern Design", "Space Planning"],
      hourlyRate: "$120-150",
      availability: "Available this week",
      matchScore: 98,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
      portfolio: 3,
      verified: true,
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Certified Interior Designer",
      rating: 4.8,
      reviews: 94,
      location: "Oakland, CA",
      radius: "30 miles",
      yearsExperience: 8,
      licenseNumber: "CA-ID-39204",
      specialties: ["Contemporary", "Color Consulting", "Lighting Design"],
      hourlyRate: "$100-130",
      availability: "Available next week",
      matchScore: 95,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      portfolio: 2,
      verified: true,
    },
    {
      id: 3,
      name: "Amanda Foster",
      title: "Interior Design Specialist",
      rating: 4.7,
      reviews: 68,
      location: "Berkeley, CA",
      radius: "20 miles",
      yearsExperience: 6,
      licenseNumber: "CA-ID-51092",
      specialties: ["Sustainable Design", "Renovation", "Custom Furniture"],
      hourlyRate: "$90-120",
      availability: "Available today",
      matchScore: 92,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
      portfolio: 4,
      verified: true,
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
            <CheckCircle2 className="w-5 h-5" />
            <span>AI Match Complete</span>
          </div>
          <h2 className="text-4xl lg:text-5xl mb-4">
            Top Professionals for Your Project
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Based on: <span className="text-gray-900">"{projectDescription}"</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Ranked by AI match score, license verification, and availability
          </p>
        </motion.div>

        {/* Professional Cards */}
        <div className="space-y-6">
          {professionals.map((pro, index) => (
            <motion.div
              key={pro.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-xl transition-shadow duration-300 border-2 border-gray-200 hover:border-blue-500">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left: Profile Image */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <ImageWithFallback
                        src={pro.image}
                        alt={pro.name}
                        className="w-32 h-32 rounded-xl object-cover"
                      />
                      {pro.verified && (
                        <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle: Professional Details */}
                  <div className="flex-grow">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl">{pro.name}</h3>
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            {pro.matchScore}% Match
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{pro.title}</p>
                        
                        {/* Rating and Location */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{pro.rating}</span>
                            <span className="text-gray-400">({pro.reviews} reviews)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{pro.location}</span>
                            <span className="text-gray-400">• {pro.radius}</span>
                          </div>
                        </div>
                      </div>

                      {/* Availability */}
                      <div className="text-right">
                        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {pro.availability}
                        </div>
                        <p className="text-2xl text-blue-600">{pro.hourlyRate}/hr</p>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {pro.specialties.map((specialty, idx) => (
                          <Badge key={idx} variant="outline" className="bg-white">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Credentials */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-blue-600" />
                        <span>{pro.yearsExperience} years experience</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>License: {pro.licenseNumber}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Request Quote
                      </Button>
                      <Button variant="outline">
                        View Portfolio ({pro.portfolio})
                      </Button>
                      <Button variant="outline">
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 mb-4">
            Don't see the right fit? We can find more professionals for you.
          </p>
          <Button variant="outline" size="lg">
            View More Matches
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
