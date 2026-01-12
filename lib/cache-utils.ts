import fs from 'fs';
import path from 'path';

const CACHE_DIRS = [
  path.join(process.cwd(), 'public', 'cache'),
  path.join(process.cwd(), 'public', 'cache', 'countries'),
  path.join(process.cwd(), 'public', 'cache', 'flight-searches'),
  path.join(process.cwd(), 'public', 'cache', 'destination-flights')
];

/**
 * Clear all cache files or only expired ones
 * @param onlyExpired If true, only removes expired cache files
 * @param maxAge Maximum age in milliseconds (default 7 days)
 * @returns Object with deletion statistics
 */
export function clearCache(onlyExpired = true, maxAge = 7 * 24 * 60 * 60 * 1000) {
  const stats = {
    total: 0,
    deleted: 0,
    errors: 0
  };
  
  // Ensure all cache directories exist
  CACHE_DIRS.forEach(dir => {
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (error) {
        console.error(`Error creating directory ${dir}:`, error);
      }
    }
  });
  
  // Process each cache directory
  CACHE_DIRS.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    
    try {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        if (file.endsWith('.json')) {
          stats.total++;
          const filePath = path.join(dir, file);
          
          try {
            if (!onlyExpired) {
              // Delete all cache files
              fs.unlinkSync(filePath);
              stats.deleted++;
              console.log(`Deleted cache file: ${filePath}`);
            } else {
              // Check if file is expired
              const content = fs.readFileSync(filePath, 'utf-8');
              const cacheData = JSON.parse(content);
              
              if (!cacheData.timestamp || (Date.now() - cacheData.timestamp > maxAge)) {
                fs.unlinkSync(filePath);
                stats.deleted++;
                console.log(`Deleted expired cache file: ${filePath}`);
              }
            }
          } catch (error) {
            console.error(`Error processing cache file ${filePath}:`, error);
            stats.errors++;
          }
        }
      });
    } catch (error) {
      console.error(`Error reading directory ${dir}:`, error);
      stats.errors++;
    }
  });
  
  return stats;
}

/**
 * Get cache statistics
 * @returns Object with cache statistics
 */
export function getCacheStats() {
  const stats = {
    totalFiles: 0,
    totalSize: 0,
    oldestTimestamp: Date.now(),
    newestTimestamp: 0,
    byDirectory: {} as Record<string, { files: number, size: number }>
  };
  
  // Process each cache directory
  CACHE_DIRS.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    
    try {
      const files = fs.readdirSync(dir);
      const dirName = path.basename(dir);
      
      stats.byDirectory[dirName] = {
        files: 0,
        size: 0
      };
      
      files.forEach(file => {
        if (file.endsWith('.json')) {
          const filePath = path.join(dir, file);
          
          try {
            const fileStats = fs.statSync(filePath);
            stats.totalFiles++;
            stats.totalSize += fileStats.size;
            stats.byDirectory[dirName].files++;
            stats.byDirectory[dirName].size += fileStats.size;
            
            // Read timestamp from file
            const content = fs.readFileSync(filePath, 'utf-8');
            const cacheData = JSON.parse(content);
            
            if (cacheData.timestamp) {
              if (cacheData.timestamp < stats.oldestTimestamp) {
                stats.oldestTimestamp = cacheData.timestamp;
              }
              if (cacheData.timestamp > stats.newestTimestamp) {
                stats.newestTimestamp = cacheData.timestamp;
              }
            }
          } catch (error) {
            console.error(`Error reading cache file ${filePath}:`, error);
          }
        }
      });
    } catch (error) {
      console.error(`Error reading directory ${dir}:`, error);
    }
  });
  
  // Convert timestamps to readable dates
  return {
    ...stats,
    oldestDate: new Date(stats.oldestTimestamp).toISOString(),
    newestDate: new Date(stats.newestTimestamp).toISOString(),
    totalSizeKB: Math.round(stats.totalSize / 1024)
  };
} 