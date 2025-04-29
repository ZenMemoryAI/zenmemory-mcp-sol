// src/mcp/tools/validateMemory.ts

import { mcp } from '../mcpServer';

/**
 * validateMemory
 * Checks that the incoming content is non-empty and does not exceed 1000 characters.
 */
@mcp.tool()
export function validateMemory(content: string): boolean {
  return content.length > 0 && content.length <= 1000;
}
