// src/services/embeddingService.ts

import { Configuration, OpenAIApi } from "openai";
import { pool } from "../db";
import { MemoryBlock } from "../types";

// 1) Initialize OpenAI client for embeddings
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * embedText
 * Calls OpenAI’s embedding API to convert text into a vector.
 */
export async function embedText(text: string): Promise<number[]> {
  const response = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: text,
  });
  return response.data.data[0].embedding;
}

/**
 * storeEmbedding
 * Updates the 'memories' table with the embedding vector for a given memoryId.
 * NOTE: your 'memories' table must have an 'embedding vector' column (pgvector).
 */
export async function storeEmbedding(memoryId: string, vector: number[]): Promise<void> {
  await pool.query(
    `UPDATE memories SET embedding = $2 WHERE id = $1`,
    [memoryId, vector]
  );
}

/**
 * fetchEmbedding
 * Retrieves the stored embedding vector for a given memoryId.
 */
export async function fetchEmbedding(memoryId: string): Promise<number[]> {
  const { rows } = await pool.query<{ embedding: number[] }>(
    `SELECT embedding FROM memories WHERE id = $1`,
    [memoryId]
  );
  if (rows.length === 0) {
    throw new Error(`No embedding found for memoryId ${memoryId}`);
  }
  return rows[0].embedding;
}

/**
 * semanticSearch
 * Performs a vector search over the 'memories' table to find the top-N most similar memories.
 */
export async function semanticSearch(
  userId: string,
  queryVec: number[],
  limit = 5
): Promise<MemoryBlock[]> {
  const { rows } = await pool.query<{
    id: string;
    user_id: string;
    content: string;
    emotion?: string;
    tags?: string[];
    created_at: Date;
  }>(
    `SELECT id, user_id, content, emotion, tags, created_at
       FROM memories
      WHERE user_id = $1
      ORDER BY embedding <-> $2
      LIMIT $3`,
    [userId, queryVec, limit]
  );
  return rows.map(r => ({
    id: r.id,
    userId: r.user_id,
    content: r.content,
    emotion: r.emotion,
    tags: r.tags,
    timestamp: r.created_at.toISOString(),
  }));
}
