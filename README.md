# ZenMemory MCP Server

Decentralized AI Memory Infrastructure — powered by MCP and Solana Agent Kit.

## Features

- 🧠 Full MCP server using `@modelcontextprotocol/typescript-sdk`
- 🔗 Solana on‑chain memory context via `@solana/agent-kit`
- 🔄 Express HTTP API: `POST /memory`, `GET /memory/:id`, `GET /user/:userId/memories`
- 🚀 In-memory or pluggable DB/IPFS storage

## Prerequisites

- Node.js >=16
- Yarn or npm
- A Solana keypair secret in environment

## Quickstart

1. **Clone & install**
   ```bash
   git clone https://github.com/your-org/zenmemory-mcp-server.git
   cd zenmemory-mcp-server
   npm install
