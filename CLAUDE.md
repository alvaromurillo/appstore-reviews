# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a TypeScript Node.js CLI tool that fetches App Store reviews for iOS applications. It can be used both as a standalone CLI and as an MCP (Model Context Protocol) server for AI assistants.

## Key Components

- **CLI entry point**: `src/index.ts` - Main command-line interface using Commander.js
- **MCP server**: `src/mcp-server.ts` - Model Context Protocol server implementation  
- **Core library**: `src/lib/appstore.ts` - App Store reviews fetching logic with pagination support
- **Build output**: `dist/` - Compiled JavaScript files

## Development Commands

```bash
# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Run CLI tool (builds first)
npm start <APP_ID> [options]

# Start MCP server (builds first)
npm run mcp

# Run built CLI directly
node dist/index.js <APP_ID> [options]

# Start built MCP server directly
node dist/mcp-server.js
```

## TypeScript Configuration

- **Target**: ES2020 with ESNext modules
- **Strict mode**: Enabled for type safety
- **Source maps**: Generated for debugging
- **Declaration files**: Generated for type exports
- **Build**: `src/` → `dist/`

## Architecture

### CLI Mode
- Uses Commander.js for argument parsing with TypeScript interfaces
- Supports country codes, output formats (JSON/console), review limits, and sorting
- Main function in `src/index.ts:27-52` handles validation and output
- Strong typing with `ProgramOptions` interface

### MCP Server Mode
- Implements MCP protocol with tools, resources, and prompts
- **Tool**: `fetchAppStoreReviews` - Direct review fetching with Zod validation
- **Resource**: `app-reviews://{appId}/{country}` - Structured data access
- **Prompts**: Pre-built analysis templates (analyze-reviews, review-summary, compare-reviews)
- Full TypeScript integration with proper interfaces

### Core Fetching Logic (`src/lib/appstore.ts`)
- Fetches from iTunes RSS API with pagination (50 reviews/page, max 500 total)
- Handles rate limiting with 100ms delays between requests
- Validates sort options with TypeScript union types: `'mostrecent' | 'mosthelpful'`
- Error handling for network issues and invalid app IDs
- Returns structured data with metadata using typed interfaces

## Type Definitions

Reviews are returned with strict TypeScript types:
```typescript
interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  author: string;
  version: string;
  date: string;
  country: string;
}

interface AppStoreReviewsResponse {
  appId: string;
  country: string;
  sortBy: string;
  totalReviews: number;
  pagesChecked: number;
  reviews: Review[];
}

type SortOption = 'mostrecent' | 'mosthelpful';
```

## Dependencies

### Runtime Dependencies
- `@modelcontextprotocol/sdk` - MCP server implementation
- `commander` - CLI argument parsing with TypeScript support
- `node-fetch` - HTTP requests to iTunes API
- `zod` - Schema validation for MCP and runtime type checking

### Development Dependencies
- `typescript` - TypeScript compiler
- `@types/node` - Node.js type definitions

## TypeScript Best Practices Followed

- ✅ **Strict mode enabled** - Full type checking
- ✅ **Interface-driven design** - Clear contracts for data structures
- ✅ **Union types** - Type-safe enums and options
- ✅ **ES modules** - Modern module system with `"type": "module"`
- ✅ **Build separation** - Clean `src/` to `dist/` compilation
- ✅ **Declaration files** - `.d.ts` files for type exports
- ✅ **Error handling** - Proper TypeScript error types

## Code Quality Standards

When working with this codebase:
- Always use TypeScript strict mode features
- Define interfaces for all data structures
- Use union types instead of magic strings
- Prefer explicit return types for public functions
- Handle errors with proper TypeScript error types
- Use Zod for runtime validation where appropriate

## Testing App IDs

- WhatsApp: `310633997`
- Instagram: `389801252`
- TikTok: `835599320`
- YouTube: `544007664`