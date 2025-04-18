import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from '@solana/web3.js';
import { AgentClient } from '@solana/agent-kit';
import dotenv from 'dotenv';
dotenv.config();

const connection = new Connection(process.env.SOLANA_RPC!);
const secret = JSON.parse(process.env.AGENT_KEYPAIR_SECRET!);
const authority = Keypair.fromSecretKey(Uint8Array.from(secret));
const agent = new AgentClient(connection, authority);


export async function recordMemoryOnChain(
  contextHash: string,
  userPubkey: string,
  timestamp: string
) {
  await agent.createMemoryContext({
    userPubkey: new PublicKey(userPubkey),
    contextHash,
    timestamp,
  });
}


export async function fetchMemoryContexts(userPubkey: string) {
  return agent.fetchContextsForUser(new PublicKey(userPubkey));
}
