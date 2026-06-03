'use server';
/**
 * @fileOverview An AI agent that analyzes uploaded images and generates specific, objective questions
 * to guide users in making more detailed scientific observations.
 *
 * - aiImageObservationGuidance - A function that handles the image analysis and question generation process.
 * - AiImageObservationGuidanceInput - The input type for the aiImageObservationGuidance function.
 * - AiImageObservationGuidanceOutput - The return type for the aiImageObservationGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiImageObservationGuidanceInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A scientific observation image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  context: z.string().optional().describe('Any additional context or topic related to the observation.'),
});
export type AiImageObservationGuidanceInput = z.infer<typeof AiImageObservationGuidanceInputSchema>;

const AiImageObservationGuidanceOutputSchema = z.object({
  questions: z.array(z.string()).describe('A list of specific, objective questions to guide detailed scientific observation.'),
});
export type AiImageObservationGuidanceOutput = z.infer<typeof AiImageObservationGuidanceOutputSchema>;

export async function aiImageObservationGuidance(
  input: AiImageObservationGuidanceInput
): Promise<AiImageObservationGuidanceOutput> {
  return aiImageObservationGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiImageObservationGuidancePrompt',
  input: {schema: AiImageObservationGuidanceInputSchema},
  output: {schema: AiImageObservationGuidanceOutputSchema},
  prompt: `You are an expert scientific observer. Your task is to analyze the provided image and generate specific, objective questions to guide a user towards making more detailed and scientific observations.

Focus on observable facts, measurements, and structural details rather than subjective interpretations.

Here is the image:
{{media url=imageDataUri}}

{{#if context}}
Consider the following context: {{{context}}}
{{/if}}

Generate 3-5 questions. The questions should be clear, concise, and encourage factual descriptions.
`,
});

const aiImageObservationGuidanceFlow = ai.defineFlow(
  {
    name: 'aiImageObservationGuidanceFlow',
    inputSchema: AiImageObservationGuidanceInputSchema,
    outputSchema: AiImageObservationGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
