import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { Upload, X } from "lucide-react";

interface PostProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PostProjectModal({ open, onOpenChange }: PostProjectModalProps) {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ description, location, budget });
    onOpenChange(false);
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
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., 'Daly City, CA'"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget">Budget (Optional)</Label>
            <Input
              id="budget"
              placeholder="e.g., '$5,000 - $15,000'"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Photos (Optional)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG up to 10MB
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Submit Project
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
