'use server';
/**
 * @fileOverview This file implements a Genkit flow for real-time AI writing coaching.
 * It analyzes user's scientific observation report text for objectivity and provides
 * Socratic questions or suggestions for refinement in a streaming fashion.
 *
 * - aiRealtimeWritingCoach - The main function to call the AI writing coach.
 * - AiRealtimeWritingCoachInput - The input type for the coaching function.
 * - AiRealtimeWritingCoachOutput - The return type for the coaching function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const AiRealtimeWritingCoachInputSchema = z.object({
  reportText: z.string().describe('The current draft of the scientific observation report text.'),
});
export type AiRealtimeWritingCoachInput = z.infer<typeof AiRealtimeWritingCoachInputSchema>;

// Output Schema
const AiRealtimeWritingCoachOutputSchema = z.object({
  feedback: z.string().describe('Real-time Socratic questions or objective writing suggestions from the AI.'),
});
export type AiRealtimeWritingCoachOutput = z.infer<typeof AiRealtimeWritingCoachOutputSchema>;

// Prompt Definition
const aiRealtimeWritingCoachPrompt = ai.definePrompt({
  name: 'aiRealtimeWritingCoachPrompt',
  input: {schema: AiRealtimeWritingCoachInputSchema},
  output: {schema: AiRealtimeWritingCoachOutputSchema},
  prompt: `You are an expert scientific writing coach. Your goal is to help a user refine their scientific observation report by providing real-time Socratic questions and suggestions to enhance objectivity and clarity.

Analyze the following report text provided by the user. If you detect any subjective, vague, emotional, or non-factual language, respond with a Socratic question or a specific suggestion that guides the user towards more objective and precise scientific descriptions. Focus on asking for quantifiable data, observable characteristics (e.g., size, number, shape, color, texture), and actions.

Do NOT rewrite the user's text. Your response should always be a question or a suggestion for improvement. Keep your feedback concise and actionable.

Here is the user's report text:
{{{reportText}}}

Provide your real-time feedback now:`,
});

// Flow Definition
const aiRealtimeWritingCoachFlow = ai.defineFlow(
  {
    name: 'aiRealtimeWritingCoachFlow',
    inputSchema: AiRealtimeWritingCoachInputSchema,
    outputSchema: AiRealtimeWritingCoachOutputSchema,
  },
  async (input) => {
    let accumulatedFeedback = '';
    const { stream, response } = aiRealtimeWritingCoachPrompt(input);

    for await (const chunk of stream) {
      if (chunk.text) {
        accumulatedFeedback += chunk.text;
      }
    }
    await response; // Ensure the full response is processed

    return { feedback: accumulatedFeedback };
  }
);

// Wrapper Function
export async function aiRealtimeWritingCoach(
  input: AiRealtimeWritingCoachInput
): Promise<AiRealtimeWritingCoachOutput> {
  return aiRealtimeWritingCoachFlow(input);
}
