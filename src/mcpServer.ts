// src/mcpServer.ts

import { FastMCP, tool, resource } from '@modelcontextprotocol/typescript-sdk';
import { MemoryBlock } from './types';

// Import your DB-backed service function
import { fetchUserMemories as dbFetchUserMemories } from './services/memoryService';

// Create a new MCP instance with your namespace
export const mcp = new FastMCP('ZenMemoryMCP');



/**
 * validateMemory
 * A simple tool that checks whether the incoming content
 * is non-empty and does not exceed 1000 characters.
 */
@mcp.tool()
export function validateMemory(content: string): boolean {
  return content.length > 0 && content.length <= 1000;
}



/**
 * fetchUserMemories
 * A resource which MCP can call to retrieve a list of MemoryBlock
 * for a given userId. This implementation delegates to your
 * memoryService, which queries the Postgres database.
 */
@mcp.resource('memories://user/{userId}')
export async function fetchUserMemories(userId: string): Promise<MemoryBlock[]> {
  // Call the DB service to get all memories for this user
  const memories = await dbFetchUserMemories(userId);
  return memories;
}
