import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { Worksheet } from "@/lib/worksheetService";
import { generateWorksheetDocx } from "@/lib/docxExportService";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  worksheet: Worksheet;
}

const ExportModal = ({ open, onOpenChange, worksheet }: ExportModalProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [examTitle, setExamTitle] = useState("PRE-BOARD EXAMINATION (2024-25)");
  const [schoolName, setSchoolName] = useState("");
  const [subject, setSubject] = useState("");
  const [className, setClassName] = useState("");
  const [time, setTime] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const [exportFormat, setExportFormat] = useState("docx");

  const validateForm = () => {
    if (!examTitle.trim()) {
      toast.error("Please enter the exam title");
      return false;
    }
    if (!schoolName.trim()) {
      toast.error("Please enter the school name");
      return false;
    }
    if (!subject.trim()) {
      toast.error("Please enter the subject");
      return false;
    }
    if (!className.trim()) {
      toast.error("Please enter the class");
      return false;
    }
    if (!time.trim()) {
      toast.error("Please enter the time duration");
      return false;
    }
    if (!maxMarks || parseInt(maxMarks) <= 0) {
      toast.error("Please enter valid maximum marks");
      return false;
    }
    return true;
  };

  const handleExport = async () => {
    if (!validateForm()) return;

    setIsExporting(true);
    try {
      console.log('Starting export with worksheet:', worksheet);
      
      if (exportFormat === "docx") {
        await generateWorksheetDocx(worksheet, {
          examTitle: examTitle.trim(),
          title: worksheet.title,
          schoolName: schoolName.trim(),
          subject: subject.trim(),
          class: className.trim(),
          time: time.trim(),
          maxMarks: parseInt(maxMarks),
        });
        toast.success("Worksheet exported successfully");
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to export worksheet");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Export Worksheet</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <label htmlFor="examTitle" className="text-sm font-medium">
              Exam Title *
            </label>
            <Input
              id="examTitle"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              placeholder="e.g. PRE-BOARD EXAMINATION (2024-25)"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="schoolName" className="text-sm font-medium">
                School Name *
              </label>
              <Input
                id="schoolName"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Enter school name"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject *
              </label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. MATHEMATICS"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="class" className="text-sm font-medium">
                Class *
              </label>
              <Input
                id="class"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="e.g. CLASS X"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="time" className="text-sm font-medium">
                Time Duration *
              </label>
              <Input
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 3 HOURS"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="maxMarks" className="text-sm font-medium">
                Maximum Marks *
              </label>
              <Input
                id="maxMarks"
                type="number"
                value={maxMarks}
                onChange={(e) => setMaxMarks(e.target.value)}
                placeholder="e.g. 80"
                min="1"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="format" className="text-sm font-medium">
                Export Format
              </label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="docx">DOCX</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleExport}
            disabled={isExporting}
            className="bg-worksheet-600 hover:bg-worksheet-700"
          >
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;