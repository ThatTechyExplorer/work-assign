import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileDown, ArrowLeft, X, HelpCircle } from "lucide-react";
import QuestionBlock from "@/components/QuestionBlock";
import ExportModal from "@/components/ExportModal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SectionSettingsDialog from "@/components/SectionSettingsDialog";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";
import { 
  Worksheet,
  WorksheetSection,
  createWorksheet,
  updateWorksheet,
  getWorksheet
} from "@/lib/worksheetService";

const DEFAULT_INSTRUCTIONS = [
  "All questions would be compulsory. However, an internal choice of approximately 33% would be provided. 50% marks are to be allotted to competency-based questions.",
  "Section A would have 16 simple/complex MCQs and 04 Assertion-Reasoning type questions carrying 1 mark each.",
  "Section B would have 6 Short Answer (SA) type questions carrying 02 marks each.",
  "Section C would have 7 Short Answer (SA) type questions carrying 03 marks each.",
  "Section D would have 3 Long Answer (LA) type questions carrying 05 marks each.",
  "Section E would have 3 source based/case based/passage based/integrated units of assessment (04 marks each) with sub-parts of the values of 1/2/3 marks.",
];

const Index = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("Untitled Paper");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalInstructions, setGeneralInstructions] = useState<string[]>(DEFAULT_INSTRUCTIONS);
  const [sections, setSections] = useState<WorksheetSection[]>([
    {
      id: String(Date.now()),
      title: "Section A",
      type: "MCQ based-question",
      marksPerQuestion: 1,
      questions: [{ text: "" }],
    },
  ]);
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadWorksheet();
    }
  }, [id]);

  const loadWorksheet = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const worksheet = await getWorksheet(id);
      if (worksheet) {
        setTitle(worksheet.title);
        setDescription(worksheet.description || "");
        // Migrate old question format to new format if needed
        const migratedSections = worksheet.sections.map(section => ({
          ...section,
          questions: section.questions.map(q => 
            typeof q === 'string' ? { text: q } : q
          ),
        }));
        setSections(migratedSections);
        setGeneralInstructions(worksheet.generalInstructions || DEFAULT_INSTRUCTIONS);
      } else {
        toast.error("Worksheet not found");
        navigate("/");
      }
    } catch (error) {
      console.error('Error loading worksheet:', error);
      toast.error("Failed to load worksheet");
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const saveWorksheet = async () => {
    if (!id) return;
    
    setIsSaving(true);
    try {
      const worksheetData: Worksheet = {
        id,
        title,
        description,
        sections,
        generalInstructions,
        lastModified: new Date().toISOString(),
      };
      
      await updateWorksheet(worksheetData);
      toast.success("Worksheet saved successfully");
    } catch (error) {
      console.error('Error saving worksheet:', error);
      toast.error("Failed to save worksheet");
    } finally {
      setIsSaving(false);
    }
  };

  const updateInstruction = (index: number, value: string) => {
    setGeneralInstructions(prev => 
      prev.map((instruction, i) => i === index ? value : instruction)
    );
  };

  const addInstruction = () => {
    setGeneralInstructions(prev => [...prev, ""]);
  };

  const removeInstruction = (index: number) => {
    setGeneralInstructions(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuestion = (sectionId: string, questionIndex: number, value: Question) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((q, i) =>
                i === questionIndex ? value : q
              ),
            }
          : section
      )
    );
  };

  const addQuestion = (sectionId: string) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? { ...section, questions: [...section.questions, { text: "" }] }
          : section
      )
    );
  };

  const deleteQuestion = (sectionId: string, questionIndex: number) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.filter((_, i) => i !== questionIndex),
            }
          : section
      )
    );
  };

  const getGlobalQuestionIndex = (sectionIndex: number, questionIndex: number) => {
    let globalIndex = questionIndex;
    for (let i = 0; i < sectionIndex; i++) {
      globalIndex += sections[i].questions.length;
    }
    return globalIndex + 1;
  };

  const updateSectionSettings = (
    sectionId: string,
    settings: { title: string; type: string; marks: number }
  ) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              title: settings.title,
              type: settings.type,
              marksPerQuestion: settings.marks,
            }
          : section
      )
    );
  };

  const addSection = () => {
    const newSection: WorksheetSection = {
      id: String(Date.now()),
      title: `Section ${String.fromCharCode(65 + sections.length)}`,
      type: "Short answer",
      marksPerQuestion: 1,
      questions: [{ text: "" }],
    };
    setSections([...sections, newSection]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading worksheet...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-worksheet-600 text-white font-bold text-xl">T</div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-worksheet-600 to-worksheet-800 text-transparent bg-clip-text">Work-Assign</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/faq">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="text-gray-600 hover:text-gray-900 border-gray-200 hover:bg-gray-50 hover:border-gray-300">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-4 flex-1">
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled Paper"
                className="text-2xl font-bold border-none p-0 h-auto text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 bg-transparent"
              />
              <Textarea
                placeholder="Add a description for your worksheet..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none border-none p-0 focus-visible:ring-0 placeholder:text-gray-400 text-gray-600 bg-transparent"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                onClick={() => setIsExportOpen(true)}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button 
                className="bg-worksheet-600 hover:bg-worksheet-700 shadow-sm transition-all duration-200 hover:shadow"
                onClick={saveWorksheet}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Worksheet"}
              </Button>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">General Instructions</h3>
              <div className="h-4 w-4 rounded-full bg-worksheet-100 flex items-center justify-center">
                <span className="text-worksheet-600 font-medium text-xs">{generalInstructions.length}</span>
              </div>
            </div>
            <div className="space-y-4">
              {generalInstructions.map((instruction, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="w-8 text-right text-gray-400 font-medium">{index + 1}.</div>
                  <div className="flex-1">
                    <Textarea
                      value={instruction}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                      placeholder="Enter instruction..."
                      className="min-h-[60px] resize-none border-gray-200 focus:border-worksheet-500 focus:ring-worksheet-500 text-gray-600"
                    />
                  </div>
                  {generalInstructions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeInstruction(index)}
                      className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 hover:bg-red-50 self-start transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                onClick={addInstruction}
                variant="ghost"
                className="mt-2 text-gray-500 hover:text-gray-700"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Instruction
              </Button>
            </div>
          </div>

          {sections.map((section, sectionIndex) => (
            <div key={section.id} className="mb-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <h2 className="font-semibold text-gray-900">{section.title}</h2>
                  <span className="text-gray-500 text-sm">{section.type}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-worksheet-50 text-worksheet-700">
                    {section.marksPerQuestion} mark each
                  </span>
                </div>
                <SectionSettingsDialog
                  sectionTitle={section.title}
                  questionType={section.type}
                  marksPerQuestion={section.marksPerQuestion}
                  onUpdate={(settings) => updateSectionSettings(section.id, settings)}
                />
              </div>

              <div className="space-y-4">
                {section.questions.map((question, questionIndex) => (
                  <QuestionBlock
                    key={questionIndex}
                    index={getGlobalQuestionIndex(sectionIndex, questionIndex)}
                    value={question}
                    onChange={(value) =>
                      updateQuestion(section.id, questionIndex, value)
                    }
                    onDelete={() => deleteQuestion(section.id, questionIndex)}
                  />
                ))}
              </div>

              <Button
                onClick={() => addQuestion(section.id)}
                variant="ghost"
                className="mt-4 text-gray-500 hover:text-gray-700"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add question
              </Button>
            </div>
          ))}

          <Button
            onClick={addSection}
            variant="outline"
            className="mt-4 border-dashed border-2 border-gray-300 hover:border-worksheet-500 hover:bg-worksheet-50 text-gray-500 hover:text-worksheet-600 w-full py-6"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add new section
          </Button>
        </div>
      </main>

      <ExportModal
        open={isExportOpen}
        onOpenChange={setIsExportOpen}
        worksheet={{
          id: id || '',
          title,
          description,
          sections,
          userId: user?.uid || '',
          createdAt: new Date() as any,
          updatedAt: new Date() as any,
          generalInstructions,
        }}
      />
    </div>
  );
};

export default Index;