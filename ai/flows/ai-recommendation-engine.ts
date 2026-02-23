'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating intelligent and context-specific
 * recommendations for sustainable urban development based on comprehensive data analysis.
 *
 * - aiRecommendationEngine - A function that orchestrates the recommendation generation process.
 * - AIRecommendationEngineInput - The input type for the aiRecommendationEngine function.
 * - AIRecommendationEngineOutput - The return type for the aiRecommendationEngine function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIRecommendationEngineInputSchema = z.object({
  climateAnalysis: z
    .string()
    .describe('Detailed climate analysis data, including trends and projections.'),
  soilAnalysis: z
    .string()
    .describe('Comprehensive soil analysis, including composition, fertility, and suitability.'),
  landUseData: z
    .string()
    .describe('Summary of current and historical urban land use patterns.'),
  predictiveModelingResults: z
    .string()
    .describe(
      'Results from predictive models, such as urban growth forecasts or environmental impact assessments.'
    ),
  urbanDevelopmentGoals: z
    .string()
    .describe('Specific goals and priorities for sustainable urban development in the area.'),
});
export type AIRecommendationEngineInput = z.infer<
  typeof AIRecommendationEngineInputSchema
>;

const AIRecommendationEngineOutputSchema = z.object({
  recommendations: z
    .string()
    .describe(
      'Comprehensive, context-specific recommendations for sustainable urban development.'
    ),
  riskMitigationStrategies: z
    .string()
    .describe('Actionable strategies to mitigate identified environmental risks.'),
  optimizationSuggestions: z
    .string()
    .describe('Suggestions for optimizing planning decisions for maximum sustainability impact.'),
});
export type AIRecommendationEngineOutput = z.infer<
  typeof AIRecommendationEngineOutputSchema
>;

export async function aiRecommendationEngine(
  input: AIRecommendationEngineInput
): Promise<AIRecommendationEngineOutput> {
  return aiRecommendationEngineFlow(input);
}

const aiRecommendationEnginePrompt = ai.definePrompt({
  name: 'aiRecommendationEnginePrompt',
  input: {schema: AIRecommendationEngineInputSchema},
  output: {schema: AIRecommendationEngineOutputSchema},
  prompt: `You are an expert urban planner and sustainability consultant for the IRA platform. Your task is to generate intelligent and context-specific recommendations for sustainable urban development.

Consider the following comprehensive data:

Climate Analysis: {{{climateAnalysis}}}

Soil Analysis: {{{soilAnalysis}}}

Land Use Data: {{{landUseData}}}

Predictive Modeling Results: {{{predictiveModelingResults}}}

Urban Development Goals: {{{urbanDevelopmentGoals}}}

Based on this information, provide detailed recommendations for sustainable urban development, including specific strategies to mitigate environmental risks and suggestions for optimizing planning decisions. Ensure your output directly addresses the requested schemas for 'recommendations', 'riskMitigationStrategies', and 'optimizationSuggestions'.`,
});

const aiRecommendationEngineFlow = ai.defineFlow(
  {
    name: 'aiRecommendationEngineFlow',
    inputSchema: AIRecommendationEngineInputSchema,
    outputSchema: AIRecommendationEngineOutputSchema,
  },
  async input => {
    const {output} = await aiRecommendationEnginePrompt(input);
    return output!;
  }
);
