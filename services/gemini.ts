import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

let chatSession: Chat | null = null;
let currentApiKey: string | undefined = undefined;

export const getChatSession = (apiKey: string): Chat => {
  if (chatSession && currentApiKey === apiKey) {
    return chatSession;
  }

  const ai = new GoogleGenAI({ apiKey });
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7, // Balanced for creativity and precision
    },
  });
  
  currentApiKey = apiKey;
  return chatSession;
};

export const resetSession = () => {
  chatSession = null;
};

export async function* sendMessageStream(
  apiKey: string,
  message: string
): AsyncGenerator<string, void, unknown> {
  try {
    const chat = getChatSession(apiKey);
    const result = await chat.sendMessageStream({ message });
    
    for await (const chunk of result) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        yield c.text;
      }
    }
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}