// Advanced search and filtering utilities for SalonShop
class SearchUtils {
  constructor() {
    this.searchIndex = new Map();
    this.filters = new Map();
  }

  // Build search index for fast lookups
  buildSearchIndex(items, searchableFields = []) {
    items.forEach((item, index) => {
      const searchTerms = this.extractSearchTerms(item, searchableFields);
      searchTerms.forEach(term => {
        if (!this.searchIndex.has(term)) {
          this.searchIndex.set(term, new Set());
        }
        this.searchIndex.get(term).add(index);
      });
    });
  }

  // Extract searchable terms from an item
  extractSearchTerms(item, fields) {
    const terms = new Set();

    fields.forEach(field => {
      const value = this.getNestedValue(item, field);
      if (value) {
        // Split into words and normalize
        const words = String(value).toLowerCase()
          .split(/[\s\-_]+/)
          .filter(word => word.length > 0);

        words.forEach(word => {
          // Add full word
          terms.add(word);
          // Add partial matches for longer words
          if (word.length > 3) {
            for (let i = 3; i <= word.length; i++) {
              terms.add(word.substring(0, i));
            }
          }
        });
      }
    });

    return Array.from(terms);
  }

  // Get nested object value by path
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Perform fuzzy search with scoring
  search(query, items, options = {}) {
    const {
      fields = [],
      fuzzyThreshold = 0.6,
      maxResults = 50,
      boostExactMatches = true,
      boostRecent = false
    } = options;

    if (!query || query.trim().length === 0) {
      return items.map((item, index) => ({ item, index, score: 1 }));
    }

    const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
    const results = [];

    items.forEach((item, index) => {
      let totalScore = 0;
      let matchedTerms = 0;

      queryTerms.forEach(queryTerm => {
        let termScore = 0;
        let termMatched = false;

        fields.forEach(field => {
          const fieldValue = String(this.getNestedValue(item, field) || '').toLowerCase();

          if (fieldValue.includes(queryTerm)) {
            // Exact match in field
            termScore = Math.max(termScore, 1.0);
            termMatched = true;
          } else {
            // Fuzzy matching
            const similarity = this.calculateSimilarity(queryTerm, fieldValue);
            if (similarity >= fuzzyThreshold) {
              termScore = Math.max(termScore, similarity * 0.8);
              termMatched = true;
            }
          }

          // Boost score for matches at the beginning of words
          if (fieldValue.startsWith(queryTerm)) {
            termScore *= 1.2;
          }
        });

        if (termMatched) {
          totalScore += termScore;
          matchedTerms++;
        }
      });

      // Calculate final score
      if (matchedTerms > 0) {
        const avgScore = totalScore / queryTerms.length;
        const coverageScore = matchedTerms / queryTerms.length;

        let finalScore = (avgScore + coverageScore) / 2;

        // Boost exact matches
        if (boostExactMatches && this.hasExactMatch(item, query, fields)) {
          finalScore *= 1.5;
        }

        // Boost recent items if applicable
        if (boostRecent && item.createdAt) {
          const daysSinceCreation = (Date.now() - new Date(item.createdAt)) / (1000 * 60 * 60 * 24);
          const recencyBoost = Math.max(0, 1 - (daysSinceCreation / 30)); // Boost for items created within last 30 days
          finalScore *= (1 + recencyBoost * 0.2);
        }

        results.push({ item, index, score: finalScore });
      }
    });

    // Sort by score and return top results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  }

  // Check if item has exact match for query
  hasExactMatch(item, query, fields) {
    const queryLower = query.toLowerCase();
    return fields.some(field => {
      const value = String(this.getNestedValue(item, field) || '').toLowerCase();
      return value.includes(queryLower);
    });
  }

  // Calculate string similarity (Levenshtein distance based)
  calculateSimilarity(str1, str2) {
    if (str1 === str2) return 1;

    const len1 = str1.length;
    const len2 = str2.length;

    if (len1 === 0 || len2 === 0) return 0;

    // Check if str1 is a substring of str2
    if (str2.includes(str1)) return len1 / len2;

    // Simple character overlap score
    const chars1 = new Set(str1.split(''));
    const chars2 = new Set(str2.split(''));
    const intersection = new Set([...chars1].filter(x => chars2.has(x)));
    const union = new Set([...chars1, ...chars2]);

    return intersection.size / union.size;
  }

  // Advanced filtering
  applyFilters(items, filters) {
    return items.filter(item => {
      return Object.entries(filters).every(([filterKey, filterValue]) => {
        if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) {
          return true; // No filter applied
        }

        const itemValue = this.getNestedValue(item, filterKey);

        if (Array.isArray(filterValue)) {
          // Multi-select filter
          return filterValue.includes(itemValue);
        } else if (typeof filterValue === 'object') {
          // Range filter (e.g., price, rating)
          const { min, max } = filterValue;
          const numValue = Number(itemValue);
          if (min !== undefined && numValue < min) return false;
          if (max !== undefined && numValue > max) return false;
          return true;
        } else {
          // Exact match filter
          return itemValue === filterValue;
        }
      });
    });
  }

  // Sort results
  sortResults(results, sortBy, sortOrder = 'asc') {
    return results.sort((a, b) => {
      let aValue = this.getNestedValue(a.item, sortBy);
      let bValue = this.getNestedValue(b.item, sortBy);

      // Handle different data types
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      } else if (aValue instanceof Date) {
        aValue = aValue.getTime();
        bValue = bValue.getTime();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Get filter options from data
  getFilterOptions(items, filterableFields) {
    const options = {};

    filterableFields.forEach(field => {
      const values = items
        .map(item => this.getNestedValue(item, field))
        .filter(value => value != null)
        .filter((value, index, arr) => arr.indexOf(value) === index) // Remove duplicates
        .sort();

      if (values.length > 0) {
        options[field] = values;
      }
    });

    return options;
  }

  // Clear search cache
  clearCache() {
    this.searchIndex.clear();
    this.filters.clear();
  }
}

// Export singleton instance
module.exports = new SearchUtils();