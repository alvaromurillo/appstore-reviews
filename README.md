# App Store Reviews CLI

[![npm version](https://badge.fury.io/js/@alvaromurillo%2Fappstore-reviews.svg)](https://badge.fury.io/js/@alvaromurillo%2Fappstore-reviews)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Command-line tool and MCP server to fetch App Store reviews for any iOS application. Works both as a standalone CLI tool and as a Model Context Protocol server for AI assistants.

## Installation

### Global Installation (CLI)
```bash
npm install -g @alvaromurillo/appstore-reviews
```

### Local Installation (Library)
```bash
npm install @alvaromurillo/appstore-reviews
```

### Development
```bash
git clone https://github.com/your-username/app-store-reviews
cd app-store-reviews
npm install
npm run build
```

## Usage

### CLI Usage (Global Installation)
```bash
# Basic usage
app-store-reviews <APP_ID>                           # Reviews to console (US store)
app-store-reviews <APP_ID> -c es                     # Reviews from Spain
app-store-reviews <APP_ID> -c mx -o reviews.json     # Save to JSON file
app-store-reviews <APP_ID> -l 50                     # Limit to 50 reviews
```

### CLI Usage (npx)
```bash
# Run without installing globally
npx appstore-reviews <APP_ID>
npx appstore-reviews <APP_ID> -c es -l 25
```

### CLI Usage (Development)
```bash
# After cloning and building
npm start <APP_ID>                                   # Reviews to console
npm start <APP_ID> -- -c es                          # Reviews from Spain
node dist/index.js <APP_ID> -c mx -o reviews.json    # Direct usage
```

## Parameters

- `<APP_ID>`: Numeric App Store app ID (required)
- `-c, --country <country>`: Country code (e.g., us, es, mx, gb). Default: us
- `-o, --output <file>`: Save results to JSON file
- `-l, --limit <number>`: Maximum number of reviews. Default: 100
- `-s, --sort <order>`: Sort order: mostrecent, mosthelpful. Default: mostrecent

## Examples

```bash
# WhatsApp reviews from Spain
app-store-reviews 310633997 -c es

# Instagram reviews saved to file
app-store-reviews 389801252 -o instagram_reviews.json

# 25 most recent TikTok reviews from Mexico
app-store-reviews 835599320 -c mx -l 25

# Most helpful Instagram reviews
app-store-reviews 389801252 -s mosthelpful

# Most helpful WhatsApp reviews from Spain, save to file
app-store-reviews 310633997 -c es -s mosthelpful -o helpful_reviews.json

# Using npx (no global installation needed)
npx appstore-reviews 544007664 -c us -l 100
```

## JSON Output Structure

```json
{
  "appId": "310633997",
  "country": "es",
  "sortBy": "mostrecent",
  "totalReviews": 50,
  "pagesChecked": 1,
  "reviews": [
    {
      "id": "...",
      "title": "Review title",
      "content": "Review content",
      "rating": 5,
      "author": "Username",
      "version": "2.23.24",
      "date": "2024-01-15T10:30:00Z",
      "country": "es"
    }
  ]
}
```

## Features

- **Pagination Support**: Automatically fetches multiple pages (up to 500 reviews)
- **Country Support**: Reviews from any App Store country
- **Sorting Options**: Most recent or most helpful reviews
- **Output Formats**: Console output or JSON file
- **Rate Limiting**: Respectful API usage with delays between requests

## App ID Examples

- WhatsApp: `310633997`
- Instagram: `389801252`
- TikTok: `835599320`
- YouTube: `544007664`

Find any App Store app ID by looking at the URL on the App Store website.

## MCP Server

This tool can also be used as an MCP (Model Context Protocol) server, allowing AI assistants like Claude to fetch and analyze App Store reviews directly.

### MCP Setup for Claude Desktop

#### Method 1: NPX (Recommended - No Installation Required)
1. **Open Claude Desktop Settings**
2. **Navigate to:** Settings → Developer → Edit Config
3. **Add the following configuration:**
   ```json
   {
     "mcpServers": {
       "app-store-reviews": {
         "command": "npx",
         "args": ["-y", "@alvaromurillo/appstore-reviews", "mcp"]
       }
     }
   }
   ```

#### Method 2: Global Installation
1. **Install globally:**
   ```bash
   npm install -g @alvaromurillo/appstore-reviews
   ```

2. **Add to Claude Desktop config:**
   ```json
   {
     "mcpServers": {
       "app-store-reviews": {
         "command": "appstore-reviews",
         "args": ["mcp"]
       }
     }
   }
   ```

#### Method 3: Claude Code CLI
If you're using Claude Code, you can add the MCP server with a single command:
```bash
claude mcp add-json app-store-reviews '{
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@alvaromurillo/appstore-reviews", "mcp"]
}'
```

#### Method 4: Development Setup
For local development or custom installations:
```json
{
  "mcpServers": {
    "app-store-reviews": {
      "command": "node",
      "args": ["/absolute/path/to/app-store-reviews/dist/index.js", "mcp"]
    }
  }
}
```

### Other IDEs

#### Cursor IDE
Add to your Cursor MCP configuration:
```json
{
  "mcpServers": {
    "app-store-reviews": {
      "command": "npx",
      "args": ["-y", "@alvaromurillo/appstore-reviews", "mcp"]
    }
  }
}
```

### Verification
After configuration, restart Claude Desktop. You should see the App Store Reviews server listed in your MCP connections. You can verify it's working by asking Claude to fetch reviews for any app.

### MCP Features

- **Tool**: `fetchAppStoreReviews` - Fetch reviews with parameters (appId, country, limit, sort)
- **Resource**: `app-reviews://{appId}/{country}` - Access reviews as structured data
- **Prompts**: Pre-built prompts for review analysis, summaries, and comparisons

### MCP Usage Examples

Once configured, you can ask Claude:
- "Analyze the reviews for WhatsApp (310633997) from Spain"
- "Compare Instagram reviews between US and Mexico"
- "Summarize the latest TikTok reviews and identify common complaints"

The MCP server provides structured access to App Store review data for AI-powered analysis and insights.

## Package Information

- **Package**: [@alvaromurillo/appstore-reviews](https://www.npmjs.com/package/@alvaromurillo/appstore-reviews)
- **Version**: 1.0.6
- **License**: MIT
- **TypeScript**: Full TypeScript support with declaration files
- **Node.js**: Requires Node.js 16+ (ES modules)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Build the project: `npm run build`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.