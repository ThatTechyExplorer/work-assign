import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useState } from "react";

interface SectionSettingsDialogProps {
  sectionTitle: string;
  questionType: string;
  marksPerQuestion: number;
  onUpdate: (settings: {
    title: string;
    type: string;
    marks: number;
  }) => void;
}

const SectionSettingsDialog = ({
  sectionTitle,
  questionType,
  marksPerQuestion,
  onUpdate,
}: SectionSettingsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(sectionTitle);
  const [type, setType] = useState(questionType);
  const [marks, setMarks] = useState(marksPerQuestion);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ title, type, marks });
    setOpen(false);
  };

  // Reset form when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setTitle(sectionTitle);
      setType(questionType);
      setMarks(marksPerQuestion);
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="hover:bg-worksheet-50 hover:text-worksheet-600"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Section Settings</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Section Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Section A"
              className="border-gray-200 focus:border-worksheet-500 focus:ring-worksheet-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium text-gray-700">
              Question Type
            </Label>
            <Input
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="e.g. MCQ based-question"
              className="border-gray-200 focus:border-worksheet-500 focus:ring-worksheet-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="marks" className="text-sm font-medium text-gray-700">
              Marks per Question
            </Label>
            <Input
              id="marks"
              type="number"
              value={marks}
              onChange={(e) => setMarks(Number(e.target.value))}
              min={1}
              className="border-gray-200 focus:border-worksheet-500 focus:ring-worksheet-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-worksheet-600 hover:bg-worksheet-700 shadow-sm transition-all duration-200 hover:shadow"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SectionSettingsDialog;