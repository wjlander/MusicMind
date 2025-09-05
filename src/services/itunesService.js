class iTunesService {
  constructor() {
    this.baseURL = 'https://itunes.apple.com/search';
  }

  async searchTracks(query, limit = 50) {
    try {
      const url = `${this.baseURL}?term=${encodeURIComponent(query)}&media=music&entity=song&limit=${limit}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to search iTunes');
      }

      const data = await response.json();
      
      // Convert iTunes format to match standard structure
      return data.results
        .filter(track => track.previewUrl && track.trackName && track.artistName)
        .map(track => ({
          id: track.trackId,
          name: track.trackName,
          artists: [{ name: track.artistName }],
          album: { 
            name: track.collectionName || track.trackName,
            images: [
              { url: track.artworkUrl100 || track.artworkUrl60 || track.artworkUrl30 },
              { url: track.artworkUrl60 || track.artworkUrl100 || track.artworkUrl30 }
            ]
          },
          preview_url: track.previewUrl,
          duration: track.trackTimeMillis ? Math.round(track.trackTimeMillis / 1000) : 30,
          external_urls: {
            itunes: track.trackViewUrl
          },
          source: 'itunes',
          popularity: track.trackPrice ? Math.round(track.trackPrice * 10) : 50, // Use price as popularity indicator
          release_date: track.releaseDate
        }));
    } catch (error) {
      console.error('Error searching iTunes:', error);
      return [];
    }
  }

  async getTracksByGenre(genre, limit = 50) {
    // iTunes doesn't have specific genre endpoints, so we'll search by genre terms
    const genreQueries = {
      'pop': 'pop hits top songs',
      'rock': 'rock hits classic rock',
      'hip-hop': 'hip hop rap hits',
      'electronic': 'electronic dance music',
      'country': 'country hits music',
      'jazz': 'jazz hits classics',
      'classical': 'classical music',
      'r-n-b': 'r&b soul hits',
      'indie': 'indie alternative hits',
      'alternative': 'alternative rock hits',
      'folk': 'folk acoustic hits',
      'blues': 'blues hits classics',
      'reggae': 'reggae hits music',
      'metal': 'metal rock hits',
      'punk': 'punk rock hits',
      'funk': 'funk soul hits',
      'soul': 'soul r&b hits',
      'disco': 'disco dance hits',
      'house': 'house electronic music',
      'techno': 'techno electronic music',
      'ambient': 'ambient electronic music',
      'latin': 'latin pop hits',
      'world': 'world music hits',
      'gospel': 'gospel christian music'
    };

    const searchQuery = genreQueries[genre.toLowerCase()] || `${genre} hits music`;
    return this.searchTracks(searchQuery, limit);
  }

  async getTracksByDecade(decade, limit = 50) {
    // Search for popular hits from specific decades
    const decadeQueries = {
      1960: '1960s hits classic rock oldies',
      1970: '1970s hits classic rock disco',
      1980: '1980s hits new wave pop rock',
      1990: '1990s hits grunge pop rock',
      2000: '2000s hits pop rock hip hop',
      2010: '2010s hits pop rock electronic'
    };

    const searchQuery = decadeQueries[decade] || `${decade}s hits popular music`;
    return this.searchTracks(searchQuery, limit);
  }

  async getPopularTracks(limit = 50) {
    // Get current popular tracks
    return this.searchTracks('top hits 2024 popular charts', limit);
  }

  getAvailableGenres() {
    return [
      'pop', 'rock', 'hip-hop', 'electronic', 'country', 'jazz', 'classical', 'r-n-b',
      'indie', 'alternative', 'folk', 'blues', 'reggae', 'metal', 'punk', 'funk',
      'soul', 'disco', 'house', 'techno', 'ambient', 'latin', 'world', 'gospel'
    ];
  }
}

export default new iTunesService();