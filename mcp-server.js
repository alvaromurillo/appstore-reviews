#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { fetchAppStoreReviews } from './lib/appstore.js';

const server = new McpServer({
  name: "app-store-reviews",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {},
    resources: {},
    prompts: {}
  }
});

// Register tool to fetch App Store reviews
server.registerTool(
  "fetchAppStoreReviews",
  {
    title: "Fetch App Store Reviews",
    description: "Fetch reviews from the App Store for a specific app",
    inputSchema: {
      appId: z.string().describe("App Store app ID (numeric)"),
      country: z.string().default("us").describe("Country code (e.g., us, es, mx)"),
      limit: z.number().min(1).max(500).default(100).describe("Maximum number of reviews to fetch"),
      sort: z.enum(["mostrecent", "mosthelpful"]).default("mostrecent").describe("Sort order for reviews")
    }
  },
  async ({ appId, country = 'us', limit = 100, sort = 'mostrecent' }) => {
    try {
      const reviews = await fetchAppStoreReviews(appId, country, limit, sort);
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(reviews, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text", 
            text: `Error fetching reviews: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
);

// Register resource for accessing app reviews
server.registerResource(
  "app-reviews",
  "app-reviews://{appId}/{country}",
  {
    title: "App Store Reviews",
    description: "Access App Store reviews for apps. Format: app-reviews://{appId}/{country}?limit={limit}&sort={sort}"
  },
  async (uri, { appId, country }) => {
    const url = new URL(uri.href);
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const sort = url.searchParams.get('sort') || 'mostrecent';
    
    try {
      const reviews = await fetchAppStoreReviews(appId, country, limit, sort);
      
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(reviews, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to fetch reviews: ${error.message}`);
    }
  }
);

// Register prompts for common review analysis tasks
server.registerPrompt(
  "analyze-reviews",
  {
    title: "Analyze App Store Reviews",
    description: "Analyze App Store reviews for sentiment, common themes, and insights",
    argsSchema: {
      appId: z.string().describe("App Store app ID"),
      country: z.string().default("us").describe("Country code")
    }
  },
  ({ appId, country = 'us' }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Please analyze the App Store reviews for app ${appId} from ${country} and provide:

1. **Sentiment Analysis**: Overall sentiment distribution (positive, negative, neutral)
2. **Common Themes**: Main topics and issues mentioned by users
3. **Rating Distribution**: Breakdown of star ratings
4. **Feature Feedback**: Specific features users love or hate
5. **Actionable Insights**: Recommendations for app improvement

Use the fetchAppStoreReviews tool to get the latest reviews data.`
        }
      }
    ]
  })
);

server.registerPrompt(
  "review-summary",
  {
    title: "App Store Reviews Summary",
    description: "Create a comprehensive summary of App Store reviews",
    argsSchema: {
      appId: z.string().describe("App Store app ID"),
      country: z.string().default("us").describe("Country code")
    }
  },
  ({ appId, country = 'us' }) => ({
    messages: [
      {
        role: "user", 
        content: {
          type: "text",
          text: `Please create a summary of App Store reviews for app ${appId} including:

1. **Key Statistics**: Total reviews, average rating, recent trends
2. **Top Positive Comments**: Best feedback from users
3. **Top Concerns**: Most common complaints or issues
4. **Version Analysis**: Feedback on recent app versions
5. **User Demographics**: Insights from different countries/regions

Use the fetchAppStoreReviews tool to gather the review data.`
        }
      }
    ]
  })
);

server.registerPrompt(
  "compare-reviews",
  {
    title: "Compare App Store Reviews",
    description: "Compare App Store reviews across different parameters",
    argsSchema: {
      appId: z.string().describe("App Store app ID"),
      countries: z.array(z.string()).default(["us"]).describe("Country codes to compare")
    }
  },
  ({ appId, countries = ["us"] }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text", 
          text: `Please compare App Store reviews for app ${appId} across countries ${countries.join(', ')} and analyze:

1. **Geographic Differences**: Compare reviews from different countries
2. **Temporal Trends**: How reviews have changed over time
3. **Rating Variations**: Differences in star ratings across regions
4. **Cultural Insights**: Region-specific feedback patterns
5. **Feature Preferences**: What features matter most in different markets

Use the fetchAppStoreReviews tool with different country parameters to gather comparison data.`
        }
      }
    ]
  })
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}