import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { motion } from "motion/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ProfessionalProfiles } from "./ProfessionalProfiles";

export function IntakeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    location: "",
    budget: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return <ProfessionalProfiles projectDescription={formData.description} />;
  }

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
                  placeholder="e.g., 'Need an interior designer for a modern living room makeover' or 'Looking for help with kitchen color scheme'"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[120px]"
                  required
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
                  placeholder="City, State or ZIP Code"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <Label htmlFor="form-budget">Budget Range (Optional)</Label>
                <Input
                  id="form-budget"
                  placeholder="e.g., '$500 - $2,000'"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>

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
        </motion.div>
      </div>
    </section>
  );
}
