import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, FileInput } from "../types";
import { fileToBase64 } from "./utils";

const GEMINI_MODEL = "gemini-3-pro-preview";

export const analyzeSleepData = async (
  audioInput: FileInput | null,
  imageInput: FileInput | null,
  trackerText: string,
  userNotes: string
): Promise<AnalysisResult> => {

  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const parts: any[] = [];

  // -----------------------------
  //  SYSTEM PROMPT (REPLACED)
  // -----------------------------
  let promptText = `
You are SleepLens, an advanced multimodal AI for sleep analysis using Gemini 3 Pro.

Your role:
Produce a deep, evidence-based sleep analysis using ALL available inputs:
- audio (snoring, pauses, breathing quality, disturbances)
- bedroom image (lighting, clutter, electronics, sleep hygiene cues)
- tracker summary (sleep duration, cycles, HR, movement)
- user notes (stress, caffeine, routines)

Your required output structure:
1. Sleep Summary
2. Stage Timeline
3. Disruptions Detected
4. Sleep Quality Score (0–100)
5. Personalized Recommendations
6. Visualization Chart (ASCII graph)

Your task details:
1. Infer sleep stages (Awake, Light, Deep, REM) using reasoning from audio + tracker data.
2. Create a timeline of at least **20 points**, each with:
   - time
   - stage
   - short description
3. Detect disruptions:
   - noise spikes
   - snoring severity
   - breathing irregularities
   - environment issues (from image)
4. Create a **Sleep Quality Score** and explain why.
5. Generate **high-quality recommendations**, not generic ones.
6. Create an ASCII sleep cycle chart, like:

Time:  | 0–1 | 1–2 | 2–3 | 3–4 |
Stage: |DEEP |DEEP |REM  |LIGHT|

Guidelines:
- If audio is short, extrapolate a realistic full-night pattern.
- Never return “I cannot analyze”; always perform best-effort reasoning.
- The tone should feel expert, structured, and reassuring.
- All output MUST follow the JSON schema defined in the request.
  `;

  parts.push({ text: promptText });

  // -----------------------------
  //  AUDIO INPUT
  // -----------------------------
  if (audioInput) {
    const audioBase64 = await fileToBase64(audioInput.file);
    parts.push({
      inlineData: {
        mimeType: audioInput.file.type,
        data: audioBase64
      }
    });
  }

  // -----------------------------
  //  IMAGE INPUT
  // -----------------------------
  if (imageInput) {
    const imageBase64 = await fileToBase64(imageInput.file);
    parts.push({
      inlineData: {
        mimeType: imageInput.file.type,
        data: imageBase64
      }
    });
  }

  // -----------------------------
  //  TEXT INPUTS
  // -----------------------------
  if (trackerText) parts.push({ text: `Tracker Summary: ${trackerText}` });
  if (userNotes) parts.push({ text: `User Notes: ${userNotes}` });

  // -----------------------------
  //  RESPONSE SCHEMA
  // -----------------------------
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER },
      summary: { type: Type.STRING },
      environmentAnalysis: { type: Type.STRING },
      timeline: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            time: { type: Type.STRING },
            stage: { type: Type.STRING, enum: ["Awake", "REM", "Light", "Deep"] },
            description: { type: Type.STRING }
          },
          required: ["time", "stage"]
        }
      },
      disruptions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            time: { type: Type.STRING },
            cause: { type: Type.STRING },
            impact: { type: Type.STRING }
          }
        }
      },
      recommendations: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    },
    required: ["score", "summary", "timeline", "disruptions", "recommendations", "environmentAnalysis"]
  };

  // -----------------------------
  //  GEMINI REQUEST
  // -----------------------------
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: { thinkingBudget: 2048 }
      }
    });

    if (!response.text) {
      throw new Error("No response text received from Gemini.");
    }

    return JSON.parse(response.text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};
