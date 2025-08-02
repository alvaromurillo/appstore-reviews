#!/usr/bin/env node

import { Command } from 'commander';
import { fetchAppStoreReviews } from './lib/appstore.js';
import fs from 'fs/promises';

const program = new Command();

program
  .name('app-store-reviews')
  .description('Fetch App Store reviews for an app')
  .version('1.0.0');

program
  .argument('<appId>', 'App Store app ID')
  .option('-c, --country <country>', 'Country code (e.g., us, es, mx)', 'us')
  .option('-o, --output <file>', 'Output to JSON file instead of console')
  .option('-l, --limit <number>', 'Number of reviews to fetch', '100')
  .option('-s, --sort <sort>', 'Sort order: mostrecent, mosthelpful', 'mostrecent')
  .action(async (appId, options) => {
    try {
      // Validate sort option
      const validSorts = ['mostrecent', 'mosthelpful'];
      if (!validSorts.includes(options.sort)) {
        console.error(`Error: Invalid sort option '${options.sort}'. Valid options are: ${validSorts.join(', ')}`);
        process.exit(1);
      }

      console.log(`Fetching reviews for app ${appId} in country ${options.country} sorted by ${options.sort}...`);
      
      const reviews = await fetchAppStoreReviews(appId, options.country, parseInt(options.limit), options.sort);
      
      console.log(`Found ${reviews.totalReviews} reviews across ${reviews.pagesChecked} pages`);
      
      if (options.output) {
        await fs.writeFile(options.output, JSON.stringify(reviews, null, 2));
        console.log(`Reviews saved to ${options.output}`);
      } else {
        console.log(JSON.stringify(reviews, null, 2));
      }
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program.parse();