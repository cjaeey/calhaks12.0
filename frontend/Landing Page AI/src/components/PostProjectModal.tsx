'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createJob, parseLocation } from "../lib/api";

interface PostProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PostProjectModal({ open, onOpenChange }: PostProjectModalProps) {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Parse location
      const { city, state, zipCode } = parseLocation(location);

      // Add budget to description if provided
      const fullPrompt = budget
        ? `${description}\n\nBudget: ${budget}`
        : description;

      // Create job
      const response = await createJob({
        prompt: fullPrompt,
        city,
        state,
        zipCode,
      });

      // Close modal
      onOpenChange(false);

      // Navigate to results page
      router.push(`/jobs/${response.jobId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Post Your Project</DialogTitle>
          <DialogDescription>
            Describe your project and we'll match you with qualified professionals in minutes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Project Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              placeholder="e.g., 'Mini-split won't cool' or 'Kitchen remodel under $15k'"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px]"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., 'San Francisco, CA' or 'Daly City, CA 94015'"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500">
              Format: City, State or City, State ZIP
            </p>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget">Budget (Optional)</Label>
            <Input
              id="budget"
              placeholder="e.g., '$5,000 - $15,000'"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
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
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Project'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500">
            Free to use • No obligations • Licensed professionals only
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
