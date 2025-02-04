import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  LevelFormat,
  convertInchesToTwip,
  BorderStyle,
  TableRow,
  TableCell,
  Table,
  WidthType,
  Packer,
  UnderlineType,
  ImageRun,
} from "docx";
import { saveAs } from "file-saver";
import { Worksheet, WorksheetSection, Question } from "./worksheetService";

interface ExportOptions {
  examTitle: string;
  title: string;
  subject: string;
  class: string;
  maxMarks: number;
  time: string;
  schoolName: string;
}

// Helper function to fetch image data
const fetchImage = async (url: string): Promise<Uint8Array> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Uint8Array(await blob.arrayBuffer());
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
};

const generateSection = async (section: WorksheetSection, sectionIndex: number) => {
  try {
    const sectionTitle = new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: {
        before: 240,
        after: 120,
      },
      children: [
        new TextRun({
          text: `SECTION-${String.fromCharCode(65 + sectionIndex)}`,
          bold: true,
          size: 24,
          underline: {
            type: UnderlineType.SINGLE,
          },
        }),
      ],
    });

    const sectionInstructions = new Paragraph({
      spacing: {
        before: 120,
        after: 120,
      },
      children: [
        new TextRun({
          text: `${section.type} type questions. Each question carries ${section.marksPerQuestion} mark${section.marksPerQuestion > 1 ? 's' : ''}.`,
          size: 24,
        }),
      ],
    });

    // Process questions and their images sequentially
    const questions = [];
    for (let qIndex = 0; qIndex < section.questions.length; qIndex++) {
      const question = section.questions[qIndex];
      const globalIndex = qIndex + 1;

      // Add question text
      questions.push(
        new Paragraph({
          spacing: {
            before: 120,
            after: question.imageUrl ? 120 : 240,
          },
          indent: {
            left: convertInchesToTwip(0.25),
            hanging: convertInchesToTwip(0.25),
          },
          children: [
            new TextRun({
              text: `${globalIndex}. `,
              bold: true,
              size: 24,
            }),
            new TextRun({
              text: question.text || '',
              size: 24,
            }),
            new TextRun({
              text: ` [${section.marksPerQuestion} Mark${section.marksPerQuestion > 1 ? 's' : ''}]`,
              bold: true,
              size: 24,
            }),
          ],
        })
      );

      // Add image if exists
      if (question.imageUrl) {
        try {
          const imageData = await fetchImage(question.imageUrl);
          questions.push(
            new Paragraph({
              spacing: {
                before: 120,
                after: 240,
              },
              children: [
                new ImageRun({
                  data: imageData,
                  transformation: {
                    width: 400,
                    height: 300,
                  },
                }),
              ],
            })
          );
        } catch (error) {
          console.error(`Error processing image for question ${globalIndex}:`, error);
          // Add a placeholder text instead of the failed image
          questions.push(
            new Paragraph({
              spacing: {
                before: 120,
                after: 240,
              },
              children: [
                new TextRun({
                  text: '[Image could not be loaded]',
                  color: 'red',
                  italics: true,
                  size: 20,
                }),
              ],
            })
          );
        }
      }
    }

    return [sectionTitle, sectionInstructions, ...questions];
  } catch (error) {
    console.error('Error in generateSection:', error);
    throw error;
  }
};

export const generateWorksheetDocx = async (
  worksheet: Worksheet,
  options: ExportOptions
) => {
  try {
    console.log('Starting DOCX generation with:', { worksheet, options });

    if (!worksheet || !worksheet.sections) {
      throw new Error('Invalid worksheet data');
    }

    if (!options.schoolName || !options.subject || !options.class || !options.time || !options.maxMarks) {
      throw new Error('Missing required export options');
    }

    // Process all sections and their images
    const sections = [];
    for (const [index, section] of worksheet.sections.entries()) {
      const sectionElements = await generateSection(section, index);
      sections.push(...sectionElements);
    }

    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: "Times New Roman",
              size: 24,
            },
          },
        },
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(1),
                right: convertInchesToTwip(1),
                bottom: convertInchesToTwip(1),
                left: convertInchesToTwip(1),
              },
            },
          },
          children: [
            // Header
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: {
                before: 0,
                after: 120,
              },
              children: [
                new TextRun({
                  text: options.examTitle,
                  bold: true,
                  size: 28,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: {
                before: 0,
                after: 120,
              },
              children: [
                new TextRun({
                  text: options.schoolName.toUpperCase(),
                  bold: true,
                  size: 28,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: {
                before: 0,
                after: 240,
              },
              children: [
                new TextRun({
                  text: options.class.toUpperCase(),
                  bold: true,
                  size: 28,
                }),
              ],
            }),

            // Time and M.M. in one line
            new Paragraph({
              spacing: {
                before: 0,
                after: 120,
              },
              children: [
                new TextRun({
                  text: "Time: ",
                  size: 24,
                }),
                new TextRun({
                  text: options.time.toUpperCase(),
                  size: 24,
                }),
                new TextRun({
                  text: "                                                                    ",
                  size: 24,
                }),
                new TextRun({
                  text: "M.M.: ",
                  size: 24,
                }),
                new TextRun({
                  text: options.maxMarks.toString(),
                  size: 24,
                }),
              ],
            }),

            // Subject centered
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: {
                before: 120,
                after: 240,
              },
              children: [
                new TextRun({
                  text: "SUBJECT: ",
                  size: 24,
                }),
                new TextRun({
                  text: options.subject.toUpperCase(),
                  size: 24,
                }),
              ],
            }),

            // General Instructions
            new Paragraph({
              spacing: {
                before: 0,
                after: 120,
              },
              children: [
                new TextRun({
                  text: "General Instructions:",
                  bold: true,
                  size: 24,
                  underline: {
                    type: UnderlineType.SINGLE,
                  },
                }),
              ],
            }),

            ...generateInstructions(worksheet.generalInstructions || []),

            // Add all sections with their questions and images
            ...sections,
          ],
        },
      ],
    });

    console.log('Document generated successfully, preparing to save...');
    const blob = await Packer.toBlob(doc);
    console.log('Document blob created successfully');

    const fileName = `${worksheet.title || 'Worksheet'}.docx`;
    saveAs(blob, fileName);
    console.log('Document saved successfully as:', fileName);

  } catch (error) {
    console.error('Error in generateWorksheetDocx:', error);
    throw error;
  }
};

const generateInstructions = (instructions: string[]) => {
  try {
    return instructions.map(
      (instruction, index) =>
        new Paragraph({
          spacing: {
            before: 0,
            after: 120,
          },
          indent: {
            left: convertInchesToTwip(0.25),
            hanging: convertInchesToTwip(0.25),
          },
          children: [
            new TextRun({
              text: `${index + 1}. `,
              bold: true,
              size: 24,
            }),
            new TextRun({
              text: instruction || '',
              size: 24,
            }),
          ],
        })
    );
  } catch (error) {
    console.error('Error in generateInstructions:', error);
    throw error;
  }
}; 