// Enhanced music service that combines multiple APIs for better reliability
import itunesService from './itunesService';
import deezerService from './deezerService';
import spotifyService from './spotifyService';

class MusicService {
  constructor() {
    this.services = [
      { name: 'itunes', service: itunesService, weight: 0.5 },
      { name: 'deezer', service: deezerService, weight: 0.3 },
      { name: 'spotify', service: spotifyService, weight: 0.2 }
    ];
  }

  async searchTracks(query, limit = 50) {
    console.log(`🎵 Searching for tracks: "${query}"`);
    const allTracks = [];

    // Try each service and collect results
    for (const { name, service, weight } of this.services) {
      try {
        console.log(`📡 Trying ${name} service...`);
        const tracks = await service.searchTracks(query, Math.ceil(limit * weight * 2));
        
        if (tracks && tracks.length > 0) {
          console.log(`✅ ${name}: Found ${tracks.length} tracks`);
          allTracks.push(...tracks);
        } else {
          console.log(`❌ ${name}: No tracks found`);
        }
      } catch (error) {
        console.error(`❌ ${name} service error:`, error.message);
      }
    }

    // Remove duplicates based on track name and artist
    const uniqueTracks = this.removeDuplicates(allTracks);
    
    // Sort by preference: iTunes first, then by popularity
    const sortedTracks = uniqueTracks.sort((a, b) => {
      if (a.source === 'itunes' && b.source !== 'itunes') return -1;
      if (b.source === 'itunes' && a.source !== 'itunes') return 1;
      return (b.popularity || 0) - (a.popularity || 0);
    });

    const finalTracks = sortedTracks.slice(0, limit);
    const tracksWithPreviews = finalTracks.filter(track => track.preview_url);
    
    console.log(`🎯 Final result: ${finalTracks.length} tracks, ${tracksWithPreviews.length} with previews`);
    
    return finalTracks;
  }

  async getTracksByGenre(genre, limit = 50) {
    console.log(`🎵 Searching genre: "${genre}"`);
    const allTracks = [];

    for (const { name, service, weight } of this.services) {
      try {
        if (service.getTracksByGenre) {
          const tracks = await service.getTracksByGenre(genre, Math.ceil(limit * weight * 2));
          if (tracks && tracks.length > 0) {
            console.log(`✅ ${name}: Found ${tracks.length} ${genre} tracks`);
            allTracks.push(...tracks);
          }
        }
      } catch (error) {
        console.error(`❌ ${name} genre search error:`, error.message);
      }
    }

    const uniqueTracks = this.removeDuplicates(allTracks);
    return this.sortAndLimit(uniqueTracks, limit);
  }

  async getTracksByDecade(decade, limit = 50) {
    console.log(`🎵 Searching decade: ${decade}s`);
    const allTracks = [];

    for (const { name, service, weight } of this.services) {
      try {
        if (service.getTracksByDecade) {
          const tracks = await service.getTracksByDecade(decade, Math.ceil(limit * weight * 2));
          if (tracks && tracks.length > 0) {
            console.log(`✅ ${name}: Found ${tracks.length} tracks from ${decade}s`);
            allTracks.push(...tracks);
          }
        }
      } catch (error) {
        console.error(`❌ ${name} decade search error:`, error.message);
      }
    }

    const uniqueTracks = this.removeDuplicates(allTracks);
    return this.sortAndLimit(uniqueTracks, limit);
  }

  async getPopularTracks(limit = 50) {
    console.log(`🎵 Searching popular tracks`);
    return this.searchTracks('top hits popular chart', limit);
  }

  removeDuplicates(tracks) {
    const seen = new Set();
    return tracks.filter(track => {
      const key = `${track.name.toLowerCase()}-${track.artists[0].name.toLowerCase()}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  sortAndLimit(tracks, limit) {
    // Prioritize tracks with previews and from reliable sources
    return tracks
      .sort((a, b) => {
        // Prioritize tracks with previews
        if (a.preview_url && !b.preview_url) return -1;
        if (b.preview_url && !a.preview_url) return 1;
        
        // Then prioritize by source reliability
        const sourceOrder = { itunes: 0, deezer: 1, spotify: 2 };
        const aOrder = sourceOrder[a.source] || 3;
        const bOrder = sourceOrder[b.source] || 3;
        
        if (aOrder !== bOrder) return aOrder - bOrder;
        
        // Finally by popularity
        return (b.popularity || 0) - (a.popularity || 0);
      })
      .slice(0, limit);
  }

  getAvailableGenres() {
    return [
      'pop', 'rock', 'hip-hop', 'electronic', 'country', 'jazz', 'classical', 'r-n-b',
      'indie', 'alternative', 'folk', 'blues', 'reggae', 'metal', 'punk', 'funk',
      'soul', 'disco', 'house', 'techno', 'ambient', 'latin', 'world', 'gospel'
    ];
  }

  // Enhanced search with fallback strategies
  async searchWithFallback(primaryQuery, fallbackQueries = [], limit = 50) {
    let tracks = await this.searchTracks(primaryQuery, limit);
    
    if (tracks.filter(t => t.preview_url).length < Math.min(5, limit)) {
      console.log(`🔄 Primary search insufficient, trying fallbacks...`);
      
      for (const fallback of fallbackQueries) {
        const fallbackTracks = await this.searchTracks(fallback, limit);
        tracks = [...tracks, ...fallbackTracks];
        
        if (tracks.filter(t => t.preview_url).length >= Math.min(10, limit)) {
          break;
        }
      }
      
      tracks = this.removeDuplicates(tracks);
    }
    
    return this.sortAndLimit(tracks, limit);
  }
}

export default new MusicService();