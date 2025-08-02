# App Store Reviews CLI

Command-line tool to fetch App Store reviews for any iOS application.

## Installation

```bash
npm install
```

## Usage

```bash
# Install dependencies
npm install

# Make CLI executable
chmod +x index.js

# Usage examples
node index.js <APP_ID>                           # Reviews to console (US store)
node index.js <APP_ID> -c es                     # Reviews from Spain
node index.js <APP_ID> -c mx -o reviews.json     # Save to JSON file
node index.js <APP_ID> -l 50                     # Limit to 50 reviews
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
node index.js 310633997 -c es

# Instagram reviews saved to file
node index.js 389801252 -o instagram_reviews.json

# 25 most recent TikTok reviews from Mexico
node index.js 835599320 -c mx -l 25

# Most helpful Instagram reviews
node index.js 389801252 -s mosthelpful

# Most helpful WhatsApp reviews from Spain, save to file
node index.js 310633997 -c es -s mosthelpful -o helpful_reviews.json
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