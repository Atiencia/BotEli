import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateResponse = async (messages: { role: 'system' | 'user' | 'assistant'; content: string }[]) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: 'openai/gpt-oss-20b',
      temperature: 0.5,
      max_tokens: 500,
    });

    return chatCompletion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error('Failed to generate response from Groq');
  }
};
