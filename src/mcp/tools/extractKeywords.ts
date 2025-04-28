// src/mcp/tools/extractKeywords.ts

import { mcp } from '../mcpServer';
import { extractKeywordsFromText } from '../../utils/keywordExtractor';

/**
 * Extract top N keywords from a text.
 */
@mcp.tool()
export function extractKeywords(content: string, topN = 5): string[] {
  return extractKeywordsFromText(content, topN);
}
