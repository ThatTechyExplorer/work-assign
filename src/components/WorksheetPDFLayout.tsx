import React from "react";

interface WorksheetPDFLayoutProps {
  schoolName: string;
  title: string;
  questions: string[];
  totalMarks: number;
}

const WorksheetPDFLayout = ({ schoolName, title, questions, totalMarks }: WorksheetPDFLayoutProps) => {
  return (
    <div className="p-8 max-w-[800px] mx-auto bg-white" id="worksheet-pdf">
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold mb-2">PRE-BOARD EXAMINATION (2024-25)</h1>
        <h2 className="text-lg font-bold mb-4">{schoolName.toUpperCase()}</h2>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>TIME: 3 HOURS</div>
          <div>{title.toUpperCase()}</div>
          <div>MM: {totalMarks}</div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-bold mb-2">General Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>All questions are compulsory.</li>
          <li>The question paper has five sections: A, B, C, D, and E.</li>
          <li>Section A contains 20 multiple-choice questions.</li>
          <li>Section B contains 6 short answer questions of 2 marks each.</li>
          <li>Section C contains 7 short answer questions of 3 marks each.</li>
          <li>Section D contains 3 long answer questions of 5 marks each.</li>
        </ol>
      </div>

      <div>
        <h3 className="font-bold mb-4 text-center">SECTION-A</h3>
        {questions.map((question, index) => (
          <div key={index} className="mb-4">
            <div className="flex">
              <span className="mr-4">{index + 1}.</span>
              <div>{question}</div>
              <span className="ml-auto">1</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorksheetPDFLayout;