// app/actions/parsePDF.js
'use server'
import Groq from 'groq-sdk';
import parseDocument from 'pdf-parse-new';

export interface ResumeSummaryI {
  title: string;
  keywords: string[];
}

const resumeSummarySchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "keywords": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": ["title", "keywords"],
  "additionalProperties": false
}
class ResumeSummary {
  title?: string;
  keywords?: string[];

  constructor(title?: string, keywords?: string[]) {
    this.title = title;
    this.keywords = keywords;
  }
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function preprocessTextForLLM(text: string) {
  // Remove excessive whitespace
  text = text.replace(/\s+/g, ' ').trim();

  // Remove special characters and non-printable characters
  text = text.replace(/[^\x20-\x7E]/g, '');

  // Truncate to a reasonable length (e.g., 4000 tokens, approx. 16000 characters)
  const maxLength = 16000;
  if (text.length > maxLength) {
    text = text.slice(0, maxLength) + '...';
  }

  // Convert to lowercase
  text = text.toLowerCase();

  // Remove common filler words (expand this list as needed)
  const fillerWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of'];
  text = text.split(' ').filter(word => !fillerWords.includes(word)).join(' ');

  return text;
}

export async function summarizeText(resume: string) {
  //use Groq to summarize the text into a format of
  // {name: string, keywords: string[], }
  const jsonSchema = JSON.stringify(resumeSummarySchema);
  const chat_completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are an agent summarize resumes and returns output in JSON.\n'The JSON object must use the schema: {
          "title": "string",
          "keywords": ["string"]
        }`,
      },
      {
        role: "user",
        content:
          `
          The following text is a preprocessed summary of a resume.
          Please provide a title like "Resume - Engineering" or "Resume - Hospitality"
          and a list of keywords that describe the resume for ${resume}
          `,
      },
    ],
    model: "mixtral-8x7b-32768",
    temperature: 0,
    stream: false,
    response_format: { type: "json_object" },
  });

  return JSON.parse(chat_completion.choices[0].message.content ?? 'Unable to parse response');
}

export async function parsePDF(formData: FormData) {
  const file = formData.get('file');
  if (!(file instanceof File)) {
    throw new Error('No file uploaded');
  }
  console.log('Parsing PDF:', file.name);
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const data = await parseDocument(buffer);
    const extractedText = data.text;
    const preprocessedText = preprocessTextForLLM(extractedText);
    const summary = await summarizeText(preprocessedText);
    console.log('Parsed PDF:', summary);
    return summary as ResumeSummaryI;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF');
  }
}
