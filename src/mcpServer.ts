// src/mcpServer.ts

import { FastMCP } from '@modelcontextprotocol/typescript-sdk';

// 1) Create your MCP instance with the chosen namespace
export const mcp = new FastMCP('ZenMemoryMCP');

// 2) Load all tool modules (each file calls @mcp.tool() internally)
import './mcp/tools/validateMemory';
import './mcp/tools/summarizeMemory';
import './mcp/tools/analyzeSentiment';
import './mcp/tools/extractKeywords';

// 3) Load all resource modules (each file calls @mcp.resource() internally)
import './mcp/resources/fetchUserMemories';
import './mcp/resources/fetchMemoriesByTag';
import './mcp/resources/fetchMemoriesByDate';
import './mcp/resources/fetchMemoryEmbedding';
import './mcp/resources/fetchTopicClusters';

// Nothing else is needed here—your tools/resources register themselves on import.
