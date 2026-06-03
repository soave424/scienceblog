import { config } from 'dotenv';
config();

import '@/ai/flows/ai-targeted-observation-prompts.ts';
import '@/ai/flows/ai-image-observation-guidance.ts';
import '@/ai/flows/ai-fact-opinion-analyzer.ts';
import '@/ai/flows/ai-realtime-writing-coach-flow.ts';