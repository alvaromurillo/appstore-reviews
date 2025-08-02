import fetch from 'node-fetch';

export async function fetchAppStoreReviews(appId, country = 'us', limit = 100, sortBy = 'mostrecent') {
  if (!appId) {
    throw new Error('App ID is required');
  }

  // Validate sortBy parameter
  const validSorts = ['mostrecent', 'mosthelpful'];
  if (!validSorts.includes(sortBy)) {
    throw new Error(`Invalid sort option '${sortBy}'. Valid options are: ${validSorts.join(', ')}`);
  }

  const countryCode = country.toLowerCase();
  const reviewsPerPage = 50; // iTunes RSS typically returns ~50 reviews per page
  const maxPages = Math.ceil(limit / reviewsPerPage);
  let allReviews = [];
  let currentPage = 1;

  try {
    while (allReviews.length < limit && currentPage <= maxPages) {
      const url = `https://itunes.apple.com/${countryCode}/rss/customerreviews/page=${currentPage}/id=${appId}/sortby=${sortBy}/json`;
      
      console.log(`Fetching page ${currentPage}: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404 && currentPage > 1) {
          // No more pages available
          console.log(`No more pages available after page ${currentPage - 1}`);
          break;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.feed || !data.feed.entry) {
        if (currentPage === 1) {
          throw new Error('No reviews found or invalid app ID');
        }
        // No more reviews available
        console.log(`No more reviews available after page ${currentPage - 1}`);
        break;
      }

      const entries = data.feed.entry;
      const pageReviews = entries
        .filter(entry => entry['im:rating']) // Filter out non-review entries
        .map(entry => ({
          id: entry.id?.label || '',
          title: entry.title?.label || '',
          content: entry.content?.label || '',
          rating: parseInt(entry['im:rating']?.label) || 0,
          author: entry.author?.name?.label || '',
          version: entry['im:version']?.label || '',
          date: entry.updated?.label || '',
          country: countryCode
        }));

      if (pageReviews.length === 0) {
        // No reviews on this page, stop fetching
        console.log(`No reviews found on page ${currentPage}`);
        break;
      }

      allReviews = allReviews.concat(pageReviews);
      currentPage++;

      // Small delay to be respectful to the API
      if (currentPage <= maxPages && allReviews.length < limit) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Limit to requested number of reviews
    const reviews = allReviews.slice(0, limit);

    return {
      appId,
      country: countryCode,
      sortBy,
      totalReviews: reviews.length,
      pagesChecked: currentPage - 1,
      reviews
    };

  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new Error('Network error: Unable to connect to App Store');
    }
    throw error;
  }
}