// src/mcp/resources/fetchMemoriesByDate.ts

import { mcp } from '../mcpServer';
import { MemoryBlock } from '../../types';
import { fetchUserMemoriesByDate } from '../../services/memoryService';

/**
 * Fetch memories for a user between two ISO timestamps.
 */
@mcp.resource('memories://user/{userId}/date/{start}/{end}')
export async function fetchMemoriesByDate(
  userId: string,
  start: string,
  end: string
): Promise<MemoryBlock[]> {
  return await fetchUserMemoriesByDate(userId, start, end);
}
