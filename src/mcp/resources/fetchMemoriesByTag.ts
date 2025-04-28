// src/mcp/resources/fetchMemoriesByTag.ts

import { mcp } from '../mcpServer';
import { MemoryBlock } from '../../types';
import { fetchUserMemoriesByTag } from '../../services/memoryService';

/**
 * Fetch all memories for a user that contain a specific tag.
 */
@mcp.resource('memories://user/{userId}/tag/{tag}')
export async function fetchMemoriesByTag(
  userId: string,
  tag: string
): Promise<MemoryBlock[]> {
  return await fetchUserMemoriesByTag(userId, tag);
}
