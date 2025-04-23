// src/services/memoryService.ts
import { pool } from "../db";
import { MemoryBlock } from "../types";

export async function fetchUserMemories(userId: string): Promise<MemoryBlock[]> {
  const { rows } = await pool.query<{
    id: string;
    content: string;
    emotion?: string;
    tags?: string[];
    timestamp: Date;
  }>(
    `SELECT id, content, emotion, tags, created_at
       FROM memories
      WHERE user_id = $1
      ORDER BY created_at DESC`,
    [userId]
  );
  return rows.map(r => ({
    id: r.id,
    userId,
    content: r.content,
    emotion: r.emotion,
    tags: r.tags,
    timestamp: r.timestamp.toISOString(),
  }));
}

export async function createMemory(
  userId: string,
  content: string,
  emotion?: string,
  tags?: string[]
): Promise<MemoryBlock> {
  const { rows } = await pool.query<{
    id: string;
    content: string;
    emotion?: string;
    tags?: string[];
    created_at: Date;
  }>(
    `INSERT INTO memories (user_id, content, emotion, tags)
     VALUES ($1, $2, $3, $4)
     RETURNING id, content, emotion, tags, created_at`,
    [userId, content, emotion || null, tags || null]
  );
  const r = rows[0];
  return {
    id: r.id,
    userId,
    content: r.content,
    emotion: r.emotion,
    tags: r.tags,
    timestamp: r.created_at.toISOString(),
  };
}
