// src/mcp/resources/fetchTopicClusters.ts

import { mcp } from '../mcpServer';
import { MemoryBlock } from '../../types';
import { fetchTopicClusters } from '../../services/clusteringService';

/**
 * Return topic-clustered groups of memories for a user.
 */
@mcp.resource('topics://user/{userId}')
export async function fetchTopicClusters(
  userId: string
): Promise<{ topic: string; memories: MemoryBlock[] }[]> {
  return await fetchTopicClusters(userId);
}
