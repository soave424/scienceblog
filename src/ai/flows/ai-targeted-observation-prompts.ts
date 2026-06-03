'use server';
/**
 * @fileOverview A Genkit flow for generating targeted scientific observation prompts based on a butterfly life cycle stage.
 *
 * - generateTargetedObservationPrompts - A function that generates observation prompts for a given life cycle stage.
 * - TargetedObservationPromptsInput - The input type for the generateTargetedObservationPrompts function.
 * - TargetedObservationPromptsOutput - The return type for the generateTargetedObservationPrompts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TargetedObservationPromptsInputSchema = z.object({
  lifeCycleStage:
    z.string().describe(
      'The current stage of the butterfly life cycle (e.g., "알" (egg), "애벌레" (larva), "번데기" (pupa), "성충" (adult)).'
    )
});
export type TargetedObservationPromptsInput = z.infer<
  typeof TargetedObservationPromptsInputSchema
>;

const TargetedObservationPromptsOutputSchema = z.object({
  observationPrompts: z
    .array(z.string())
    .describe('A list of scientific observation prompts tailored to the life cycle stage.')
});
export type TargetedObservationPromptsOutput = z.infer<
  typeof TargetedObservationPromptsOutputSchema
>;

const generateObservationPromptsPrompt = ai.definePrompt({
  name: 'generateObservationPromptsPrompt',
  input: {schema: TargetedObservationPromptsInputSchema},
  output: {schema: TargetedObservationPromptsOutputSchema},
  prompt: `당신은 초등학생을 위한 과학 관찰 교육 전문가입니다.\n주어진 나비의 생장 단계를 바탕으로 학생들이 과학적 사고력과 논리적 글쓰기 능력을 향상시킬 수 있도록, 해당 단계에 최적화된 구체적인 과학 관찰 프롬프트 3-5가지를 한국어로 생성해주세요.\n\n각 프롬프트는 학생들이 무엇을 관찰해야 할지 명확하게 제시하며, 질문 형식으로 작성되어야 합니다.\n\n예시:\n만약 생장 단계가 "애벌레"라면, 다음과 같은 프롬프트를 생성합니다.\n- 애벌레는 어떤 색깔과 무늬를 가지고 있나요? 몸 전체를 자세히 관찰해보세요.\n- 애벌레의 다리는 몇 개이며, 어떻게 움직이는지 설명해보세요.\n- 애벌레가 식물을 먹을 때 어떤 변화가 생기나요? 먹는 모습과 식물의 변화를 기록해보세요.\n- 애벌레가 허물을 벗는 과정은 어떻게 진행되나요? 허물 벗기 전후의 모습을 비교해보세요.\n\n---\n현재 생장 단계: {{{lifeCycleStage}}}\n\n생성할 과학 관찰 프롬프트 목록:`
});

export const generateTargetedObservationPromptsFlow = ai.defineFlow(
  {
    name: 'generateTargetedObservationPromptsFlow',
    inputSchema: TargetedObservationPromptsInputSchema,
    outputSchema: TargetedObservationPromptsOutputSchema
  },
  async input => {
    const {output} = await generateObservationPromptsPrompt(input);
    return output!;
  }
);

export async function generateTargetedObservationPrompts(
  input: TargetedObservationPromptsInput
): Promise<TargetedObservationPromptsOutput> {
  return generateTargetedObservationPromptsFlow(input);
}
