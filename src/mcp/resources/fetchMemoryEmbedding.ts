// src/mcp/resources/fetchMemoryEmbedding.ts

import { mcp } from '../mcpServer';
import { fetchEmbedding } from '../../services/embeddingService';

/**
 * Return the stored vector embedding for a given memory block.
 */
@mcp.resource('embeddings://memory/{memoryId}')
export async function fetchMemoryEmbedding(
  memoryId: string
): Promise<number[]> {
  return await fetchEmbedding(memoryId);
}
