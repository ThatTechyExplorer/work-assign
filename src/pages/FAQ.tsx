import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How do I create a new worksheet?",
      answer: "Click the 'Create Worksheet' button on the dashboard. Fill in the title and description, then start adding sections and questions. You can customize each section with different types of questions and marks per question."
    },
    {
      question: "Can I add images to questions?",
      answer: "Yes! When creating or editing a question, you'll find an 'Add Image' button below the question text box. Click it to upload an image from your device. The image will be displayed with the question and included in the exported worksheet."
    },
    {
      question: "How do I export my worksheet?",
      answer: "Click the 'Export' button on your worksheet. You can customize the export settings including exam title, school name, subject, class, time duration, and maximum marks. The worksheet will be exported as a professionally formatted DOCX file."
    },
    {
      question: "Can I edit a worksheet after creating it?",
      answer: "Yes, you can edit your worksheets at any time. From the dashboard, click on the worksheet you want to modify. You can change the title, description, add/remove sections, modify questions, and update images."
    },
    {
      question: "How do I organize questions into sections?",
      answer: "Each worksheet can have multiple sections (e.g., Section-A, Section-B). For each section, you can specify the question type and marks per question. This helps in organizing questions by difficulty level or type."
    },
    {
      question: "What happens to my worksheets if I log out?",
      answer: "Your worksheets are safely stored in our database and linked to your account. When you log back in, you'll find all your worksheets exactly as you left them."
    },
    {
      question: "Can I delete a worksheet?",
      answer: "Yes, you can delete any worksheet you've created. On the dashboard, find the worksheet you want to delete and click the delete icon. You'll be asked to confirm before the worksheet is permanently removed."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about using Work-Assign
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-gray-200 last:border-0"
              >
                <AccordionTrigger className="text-base font-medium text-gray-900 hover:text-worksheet-600 hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-8 text-sm text-gray-600">
          <p>
            Still have questions?{' '}
            <a
              href="mailto:support@work-assign.com"
              className="text-worksheet-600 hover:text-worksheet-700 font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 