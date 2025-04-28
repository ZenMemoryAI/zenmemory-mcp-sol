// src/mcp/tools/summarizeMemory.ts

import { mcp } from '../mcpServer';
import { callOpenAI } from '../../utils/openai';  // your OpenAI helper

/**
 * Summarize a list of conversation blocks into a concise paragraph.
 */
@mcp.tool()
export async function summarizeMemory(contents: string[]): Promise<string> {
  const prompt = `Summarize the following conversation:\n\n${contents.join('\n\n')}`;
  return await callOpenAI(prompt);
}
