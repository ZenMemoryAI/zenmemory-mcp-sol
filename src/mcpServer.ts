import { FastMCP, tool, resource } from '@modelcontextprotocol/typescript-sdk';
import { MemoryBlock } from './types';

export const mcp = new FastMCP('ZenMemoryMCP');


@mcp.tool()
export function validateMemory(content: string): boolean {
  return content.length > 0 && content.length <= 1000;
}


@mcp.resource('memories://user/{userId}')
export async function fetchUserMemories(userId: string): Promise<MemoryBlock[]> {
  return []; // DB
}
