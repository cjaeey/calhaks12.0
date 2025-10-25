'use client';

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { motion } from "framer-motion";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createJob, parseLocation } from "../lib/api";

export function IntakeForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [matches, setMatches] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    location: "",
    budget: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    setShowResults(false);

    try {
      // Parse location
      const { city, state, zipCode } = parseLocation(formData.location);

      // Add budget to description if provided
      const fullPrompt = formData.budget
        ? `${formData.description}\n\nBudget: ${formData.budget}`
        : formData.description;

      // Create job - now returns matches immediately
      const response = await createJob({
        prompt: fullPrompt,
        city,
        state,
        zipCode,
      });

      // Show results inline
      setMatches(response.matches || []);
      setShowResults(true);
      setIsSubmitting(false);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to submit project');
      setIsSubmitting(false);
    }
  };

  return (
    <section id="intake-form" className="py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl mb-4">
              Find Your Professional
            </h2>
            <p className="text-xl text-gray-600">
              Tell us about your project and get matched with verified pros
            </p>
          </div>

          <Card className="p-8 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Description */}
              <div className="space-y-2">
                <Label htmlFor="form-description">Describe Your Project</Label>
                <Textarea
                  id="form-description"
                  placeholder="e.g., 'Need HVAC repair for noisy AC unit' or 'Kitchen remodel with modern appliances'"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[120px]"
                  required
                  disabled={isSubmitting}
                />
                <p className="text-sm text-gray-500">
                  Be specific about the issue or work needed
                </p>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="form-location">Location</Label>
                <Input
                  id="form-location"
                  placeholder="e.g., 'San Francisco, CA' or 'Oakland, CA 94612'"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
                <p className="text-sm text-gray-500">
                  Format: City, State or City, State ZIP
                </p>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <Label htmlFor="form-budget">Budget Range (Optional)</Label>
                <Input
                  id="form-budget"
                  placeholder="e.g., '$500 - $2,000'"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Finding Professionals...
                  </>
                ) : (
                  "Get Matched Now"
                )}
              </Button>

              <p className="text-xs text-center text-gray-500">
                Free to use • No obligations • Licensed professionals only
              </p>
            </form>
          </Card>

          {/* Results Section */}
          {showResults && matches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12"
            >
              <h3 className="text-3xl font-bold text-center mb-8">
                Found {matches.length} Professionals
              </h3>
              <div className="space-y-4">
                {matches.map((match: any) => (
                  <Card key={match.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900">{match.name}</h4>
                        <p className="text-gray-600">{match.trade}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {match.city}, {match.state}
                        </p>
                        <div className="mt-3 flex items-center gap-4">
                          <span className="text-sm font-medium text-gray-700">
                            ⭐ {match.rating?.toFixed(1) || 'N/A'}
                          </span>
                          <span className="text-sm text-gray-600 capitalize">
                            {match.price_band} pricing
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-gray-700">{match.reason}</p>
                        {match.services && match.services.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {match.services.map((service: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                              >
                                {service}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {match.score}
                        </div>
                        <div className="text-xs text-gray-500">Match Score</div>
                        {match.website && (
                          <a
                            href={match.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-block text-sm text-blue-600 hover:underline"
                          >
                            Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
