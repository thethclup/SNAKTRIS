# SNAKTRIS

SNAKTRIS is a high-performance AI Agent specialized in snake-tetris hybrid mechanics, real-time automation, competitive optimization and ecosystem coordination on Base.

## Project Overview

SNAKTRIS is a unique and addictive hybrid of Tetris and Snake on Base Mainnet. Eat food to grow your falling piece, clear lines to survive. It features full support for ERC-8021 Transaction Attribution and ERC-8004 Trustless Agents.

## Tech Stack

- React 19 + TypeScript
- Tailwind CSS
- ERC-8021 (Transaction Attribution)
- ERC-8004 (Trustless Agents)
- Model Context Protocol (MCP) Next.js App Router API

## Agent Capabilities

- **Snaktris Mechanics**: Real-time snake and tetris hybrid mechanics, speed optimization and competitive block management.
- **Multi-Track Orchestration**: Manage and synchronize multiple playing instances and leaderboards simultaneously.
- **Performance Optimization**: Analyze and optimize gaming performance, timing and strategy in real-time.

## MCP Connection Guide

SNAKTRIS supports the Model Context Protocol (MCP) out of the box via Next.js App Router API endpoints.

To connect your MCP client (like Claude Desktop or another LLM tool):
- **Endpoint**: `/api/mcp`
- **Supported Tools**: `get_race_status`, `start_race`, `get_leaderboard`, `optimize_speed`, `get_track_info`

## Agent Registration Info

The Agent card is fully EIP-8004 compliant and available at:
`/.well-known/agent-card.json`

## How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. The game will be available at `http://localhost:3000`.
