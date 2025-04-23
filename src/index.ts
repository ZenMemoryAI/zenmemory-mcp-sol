// src/index.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

import { mcp } from './mcpServer';
import { recordMemoryOnChain, fetchMemoryContexts } from './solana';
import { MemoryBlock } from './types';

// Import database-backed service functions
import {
  createMemory as dbCreateMemory,
  fetchUserMemories as dbFetchUserMemories,
  fetchMemoryById as dbFetchMemoryById,
} from './services/memoryService';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const enableSolana = process.env.ENABLE_SOLANA === '1';
const enableMCP = process.env.ENABLE_MCP === '1';

app.use(cors());
app.use(express.json());

/**
 * POST /memory
 * - Validate input using MCP tool
 * - Persist memory into Postgres via memoryService
 * - Optionally record the memory on Solana blockchain
 */
app.post('/memory', async (req, res) => {
  const { userId, content, emotion, tags } = req.body;

  // Return error if required fields are missing
  if (!userId || !content) {
    return res.status(400).json({ error: 'userId and content required' });
  }

  // Validate content length with MCP
  if (enableMCP && !mcp.call('validateMemory', content)) {
    return res.status(400).json({ error: 'Content failed validation' });
  }

  try {
    // Save memory to the database
    const memory: MemoryBlock = await dbCreateMemory(userId, content, emotion, tags);

    // Record memory on Solana if enabled
    if (enableSolana) {
      try {
        await recordMemoryOnChain(memory.id, memory.userId, memory.timestamp);
      } catch (err) {
        console.error('Solana record error', err);
      }
    }

    return res.status(201).json({ message: 'Memory stored', memory });
  } catch (err) {
    console.error('Database error on createMemory', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /memory/:id
 * - Retrieve a single memory by its ID from the database
 */
app.get('/memory/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch memory from the database
    const memory = await dbFetchMemoryById(id);
    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }
    return res.json(memory);
  } catch (err) {
    console.error('Database error on fetchMemoryById', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /user/:userId/memories
 * - Retrieve all memories for a specific user from the database
 * - Optionally include on-chain contexts if Solana integration is enabled
 */
app.get('/user/:userId/memories', async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch off-chain memories from the database
    const offchain = await dbFetchUserMemories(userId);

    if (enableSolana) {
      // Fetch on-chain memory contexts
      const onchain = await fetchMemoryContexts(userId);
      return res.json({ offchain, onchain });
    }

    return res.json({ offchain });
  } catch (err) {
    console.error('Database error on fetchUserMemories', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

