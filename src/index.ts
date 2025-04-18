import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { mcp } from './mcpServer';
import { recordMemoryOnChain, fetchMemoryContexts } from './solana';
import { MemoryBlock } from './types';

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
const enableSolana = process.env.ENABLE_SOLANA === '1';
const enableMCP = process.env.ENABLE_MCP === '1';

app.use(cors());
app.use(express.json());


const memoryStore: Record<string, MemoryBlock> = {};

app.post('/memory', async (req, res) => {
  const { userId, content, emotion, tags } = req.body;
  if (!userId || !content)
    return res.status(400).json({ error: 'userId and content required' });


  if (enableMCP && !mcp.call('validateMemory', content)) {
    return res.status(400).json({ error: 'Content failed validation' });
  }

  const memory: MemoryBlock = {
    id: uuidv4(),
    userId,
    content,
    emotion,
    tags,
    timestamp: new Date().toISOString(),
  };
  memoryStore[memory.id] = memory;


  if (enableSolana) {
    try {
      await recordMemoryOnChain(memory.id, memory.userId, memory.timestamp);
    } catch (e) {
      console.error('Solana record error', e);
    }
  }

  res.status(201).json({ message: 'Memory stored', memory });
});

app.get('/memory/:id', (req, res) => {
  const memory = memoryStore[req.params.id];
  if (!memory) return res.status(404).json({ error: 'Not found' });
  res.json(memory);
});

app.get('/user/:userId/memories', async (req, res) => {
  const offchain = Object.values(memoryStore).filter(
    (m) => m.userId === req.params.userId
  );
  if (enableSolana) {
    const onchain = await fetchMemoryContexts(req.params.userId);
    return res.json({ offchain, onchain });
  }
  res.json({ offchain });
});

app.listen(port, () => console.log(`Server running on ${port}`));
