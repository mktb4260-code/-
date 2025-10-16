
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Function to convert data URL to base64 and mimeType
const dataUrlToInlineData = (dataUrl: string) => {
  const parts = dataUrl.split(',');
  const mimeType = parts[0].match(/:(.*?);/)?.[1];
  if (!mimeType) {
    throw new Error("Invalid data URL: mimeType not found");
  }
  const base64Data = parts[1];
  return { mimeType, data: base64Data };
};

export const editImageWithGemini = async (base64Image: string, prompt: string): Promise<string> => {
  try {
    const { mimeType, data } = dataUrlToInlineData(base64Image);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const editedBase64 = part.inlineData.data;
        const editedMimeType = part.inlineData.mimeType;
        return `data:${editedMimeType};base64,${editedBase64}`;
      }
    }

    throw new Error("No image data found in the API response.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};
