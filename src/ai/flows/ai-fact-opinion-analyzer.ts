'use server';
/**
 * @fileOverview An AI fact/opinion analyzer that helps users differentiate between facts and opinions in scientific writing.
 *
 * - analyzeFactOpinion - A function that handles the analysis of user text for subjective statements and suggests objective rephrasing.
 * - AiFactOpinionAnalyzerInput - The input type for the analyzeFactOpinion function.
 * - AiFactOpinionAnalyzerOutput - The return type for the analyzeFactOpinion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Input schema for the AI fact/opinion analyzer flow.
 * @property observationText - The scientific observation text to analyze for subjective statements.
 */
const AiFactOpinionAnalyzerInputSchema = z.object({
  observationText: z.string().describe('The scientific observation text to analyze for subjective statements.'),
});
export type AiFactOpinionAnalyzerInput = z.infer<typeof AiFactOpinionAnalyzerInputSchema>;

/**
 * Output schema for the AI fact/opinion analyzer flow.
 * @property hasSubjectiveStatements - True if the provided text contains subjective statements that need rephrasing, false otherwise.
 * @property analysis - An array of identified subjective statements with explanations and objective suggestions.
 */
const AiFactOpinionAnalyzerOutputSchema = z.object({
  hasSubjectiveStatements: z.boolean().describe('True if the provided text contains subjective statements that need rephrasing, false otherwise.'),
  analysis: z.array(z.object({
    originalStatement: z.string().describe('The original subjective statement identified in the text.'),
    subjectivityExplanation: z.string().describe('An explanation of why the statement is considered subjective.'),
    objectiveSuggestion: z.string().describe('A suggested rephrasing of the statement to make it objective and factual.'),
  })).describe('An array of identified subjective statements with explanations and objective suggestions.'),
});
export type AiFactOpinionAnalyzerOutput = z.infer<typeof AiFactOpinionAnalyzerOutputSchema>;

const aiFactOpinionAnalyzerPrompt = ai.definePrompt({
  name: 'aiFactOpinionAnalyzerPrompt',
  input: { schema: AiFactOpinionAnalyzerInputSchema },
  output: { schema: AiFactOpinionAnalyzerOutputSchema },
  prompt: `You are an AI assistant specialized in analyzing scientific observation texts. Your goal is to help users identify and correct subjective statements, guiding them to write objectively and factually.

Analyze the following scientific observation text. For each sentence or phrase that expresses an opinion, feeling, interpretation, or any other subjective element rather than a measurable or verifiable fact, identify it.

For each subjective statement found:
1. Extract the 'originalStatement'.
2. Provide a 'subjectivityExplanation' detailing why it is subjective (e.g., uses emotional language, states an unverified interpretation, expresses a personal feeling, or is not measurable/observable).
3. Offer an 'objectiveSuggestion' that rephrases the statement to be purely factual, descriptive, and verifiable, avoiding any subjective language.

If no subjective statements are found, set 'hasSubjectiveStatements' to false and provide an empty 'analysis' array.

Here is the text to analyze:
{{{observationText}}}`,
});

const aiFactOpinionAnalyzerFlow = ai.defineFlow(
  {
    name: 'aiFactOpinionAnalyzerFlow',
    inputSchema: AiFactOpinionAnalyzerInputSchema,
    outputSchema: AiFactOpinionAnalyzerOutputSchema,
  },
  async (input) => {
    const { output } = await aiFactOpinionAnalyzerPrompt(input);
    return output!;
  }
);

export async function analyzeFactOpinion(input: AiFactOpinionAnalyzerInput): Promise<AiFactOpinionAnalyzerOutput> {
  return aiFactOpinionAnalyzerFlow(input);
}
