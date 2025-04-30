// src/services/questService.ts

import { pool } from '../db';

export interface Quest {
  id: string;
  name: string;
  description: string;
  tag: string;
  targetCount: number;
  rewardAmount: number;
}

/**
 * getAllQuests
 * Returns all available quests.
 */
export async function getAllQuests(): Promise<Quest[]> {
  const { rows } = await pool.query<{
    id: string; name: string; description: string;
    tag: string; target_count: number; reward_amount: number;
  }>(`SELECT * FROM quests`);
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    description: r.description,
    tag: r.tag,
    targetCount: r.target_count,
    rewardAmount: Number(r.reward_amount),
  }));
}

/**
 * recordMemoryForQuests
 * Increase progress for any quest matching one of the memory tags.
 * If target is reached and not yet claimed, mark claimed and log reward.
 */
export async function recordMemoryForQuests(
  userId: string,
  tags: string[] = []
): Promise<{ questId: string; rewardAmount: number }[]> {
  if (tags.length === 0) return [];

  // 1) Find quests whose tag is in this memory's tags
  const { rows: questRows } = await pool.query<{
    id: string; target_count: number; reward_amount: number;
  }>(
    `SELECT id, target_count, reward_amount
       FROM quests
      WHERE tag = ANY($1)`,
    [tags]
  );

  const claimedRewards: { questId: string; rewardAmount: number }[] = [];

  for (const { id: questId, target_count, reward_amount } of questRows) {
    // 2) Upsert progress row
    await pool.query(
      `INSERT INTO quest_progress(user_id, quest_id, count)
         VALUES ($1, $2, 1)
       ON CONFLICT (user_id, quest_id)
         DO UPDATE SET count = quest_progress.count + 1`,
      [userId, questId]
    );

    // 3) Fetch updated progress
    const { rows } = await pool.query<{ count: number; claimed: boolean }>(
      `SELECT count, claimed
         FROM quest_progress
        WHERE user_id = $1 AND quest_id = $2`,
      [userId, questId]
    );
    const { count, claimed } = rows[0];

    // 4) If reached target and not yet claimed, mark claimed and award
    if (!claimed && count >= target_count) {
      await pool.query(
        `UPDATE quest_progress
            SET claimed = TRUE
          WHERE user_id = $1 AND quest_id = $2`,
        [userId, questId]
      );
      await pool.query(
        `INSERT INTO user_rewards(user_id, quest_id, reward_amount)
             VALUES ($1, $2, $3)`,
        [userId, questId, reward_amount]
      );
      claimedRewards.push({ questId, rewardAmount: Number(reward_amount) });
    }
  }

  return claimedRewards;
}

/**
 * getUserQuests
 * Returns user's progress and claimed status on all quests.
 */
export async function getUserQuests(userId: string): Promise<
  (Quest & { count: number; claimed: boolean })[]
> {
  const { rows } = await pool.query<{
    id: string; name: string; description: string;
    tag: string; target_count: number; reward_amount: number;
    count: number; claimed: boolean;
  }>(
    `SELECT q.*, p.count, p.claimed
       FROM quests q
  LEFT JOIN quest_progress p
         ON q.id = p.quest_id AND p.user_id = $1`,
    [userId]
  );
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    description: r.description,
    tag: r.tag,
    targetCount: r.target_count,
    rewardAmount: Number(r.reward_amount),
    count: r.count || 0,
    claimed: r.claimed || false,
  }));
}
