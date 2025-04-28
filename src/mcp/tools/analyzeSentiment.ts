// src/mcp/tools/analyzeSentiment.ts

import { mcp } from '../mcpServer';
import sentimentApi from '../../services/sentimentApi'; // your sentiment-analysis service

/**
 * Return sentiment score and label for a message.
 */
@mcp.tool()
export async function analyzeSentiment(content: string): Promise<{
  score: number;              // e.g. –1.0 to +1.0
  label: 'positive' | 'neutral' | 'negative';
}> {
  return sentimentApi.analyze(content);
}
