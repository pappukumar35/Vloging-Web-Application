
import { GoogleGenAI, GenerateContentResponse, Content } from "@google/genai";
import { Location } from '../types';

const API_KEY = process.env.API_KEY;
const isKeyInvalid = !API_KEY || API_KEY.includes('YOUR_') || API_KEY.includes('PLACEHOLDER');

// We create the AI instance only if the key is valid.
const ai = !isKeyInvalid ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const keyErrorMessage = "API Key is not configured correctly. Please create a .env file, add your API_KEY, and restart the server.";

// Helper function to check for the key and AI instance before every API call
const checkApiKey = () => {
    if (isKeyInvalid || !ai) {
        console.error(keyErrorMessage);
        throw new Error(keyErrorMessage);
    }
    return ai;
}

export const generateChatResponse = async (prompt: string, history: { role: 'user' | 'model'; parts: string }[]) => {
  try {
    const ai = checkApiKey();
    const model = 'gemini-2.5-flash';

    const contents: Content[] = [
      ...history.map(h => ({ role: h.role, parts: [{ text: h.parts }] })),
      { role: 'user', parts: [{ text: prompt }] }
    ];

    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating chat response:", error);
    if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes(keyErrorMessage))) {
        return "Sorry, I couldn't get a response due to an API key configuration issue. Please check the setup instructions and restart the app.";
    }
    return "Sorry, I encountered an error. Please try again.";
  }
};

export const generateImage = async (prompt: string, aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4'): Promise<string> => {
    try {
        const ai = checkApiKey();
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: aspectRatio,
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        throw new Error("No image generated");
    } catch (error) {
        console.error("Error generating image:", error);
        if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes(keyErrorMessage))) {
            throw new Error("Image generation failed due to an API key configuration issue. Please verify your .env file and API key.");
        }
        throw new Error("Failed to generate image. Please check your prompt and try again.");
    }
};

export const findPlaces = async (prompt: string, location: Location | null) => {
    try {
        const ai = checkApiKey();
        const config: any = {
            tools: [{ googleMaps: {} }],
        };
        
        if (location) {
            config.toolConfig = {
                retrievalConfig: {
                    latLng: {
                        latitude: location.latitude,
                        longitude: location.longitude
                    }
                }
            };
        }

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: config,
        });

        const text = response.text;
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        return { text, groundingChunks };
    } catch (error) {
        console.error("Error finding places:", error);
        if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes(keyErrorMessage))) {
            throw new Error("API Key Error: Please verify your .env file and ensure your API key is correct and active.");
        }
        throw new Error("Search Failed: Could not get a response. This can happen due to an invalid API key or a problem with the service. Please check your API key's permissions (e.g., Maps Platform APIs enabled) and try again.");
    }
};

export const findPlacesWithImage = async (prompt: string, image: { data: string; mimeType: string }, location: Location | null) => {
    try {
        const ai = checkApiKey();
        const config: any = {
            tools: [{ googleMaps: {} }],
        };
        
        if (location) {
            config.toolConfig = {
                retrievalConfig: {
                    latLng: {
                        latitude: location.latitude,
                        longitude: location.longitude
                    }
                }
            };
        }
        
        const imagePart = {
          inlineData: {
            mimeType: image.mimeType,
            data: image.data,
          },
        };
        const textPart = {
          text: prompt
        };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [textPart, imagePart] },
            config: config,
        });

        const text = response.text;
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        return { text, groundingChunks };
    } catch (error) {
        console.error("Error finding places with image:", error);
        if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes(keyErrorMessage))) {
            throw new Error("API Key Error: Please verify your .env file and ensure your API key is correct and active.");
        }
        throw new Error("Search Failed: Could not get a response. This can happen due to an invalid API key or a problem with the service. Please check your API key's permissions (e.g., Maps Platform APIs enabled) and try again.");
    }
};
