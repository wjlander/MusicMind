class DeezerService {
  constructor() {
    this.baseURL = 'https://api.deezer.com';
  }

  async searchTracks(query, limit = 50) {
    try {
      // Use CORS proxy for Deezer API since it doesn't support direct browser access
      const corsProxy = 'https://api.allorigins.win/raw?url=';
      const url = `${corsProxy}${encodeURIComponent(`${this.baseURL}/search?q=${encodeURIComponent(query)}&limit=${limit}`)}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to search Deezer');
      }

      const data = await response.json();
      
      // Convert Deezer format to match our standard structure
      return data.data
        .filter(track => track.preview && track.title && track.artist && track.artist.name)
        .map(track => ({
          id: track.id,
          name: track.title,
          artists: [{ name: track.artist.name }],
          album: { 
            name: track.album ? track.album.title : track.title,
            images: [
              { url: track.album ? track.album.cover_medium : track.artist.picture_medium },
              { url: track.album ? track.album.cover_small : track.artist.picture_small }
            ]
          },
          preview_url: track.preview,
          duration: track.duration,
          external_urls: {
            deezer: track.link
          },
          source: 'deezer'
        }));
    } catch (error) {
      console.error('Error searching Deezer:', error);
      return [];
    }
  }

  async getTracksByGenre(genre, limit = 50) {
    // Deezer genre searches
    const genreQueries = {
      'pop': 'pop hits chart',
      'rock': 'rock hits classic',
      'hip-hop': 'hip hop rap hits',
      'electronic': 'electronic dance hits',
      'country': 'country hits',
      'jazz': 'jazz classics',
      'classical': 'classical music',
      'r-n-b': 'rnb soul hits',
      'indie': 'indie alternative',
      'alternative': 'alternative rock',
      'folk': 'folk acoustic',
      'blues': 'blues classics',
      'reggae': 'reggae hits',
      'metal': 'metal rock',
      'punk': 'punk rock',
      'funk': 'funk soul',
      'soul': 'soul music',
      'disco': 'disco hits',
      'house': 'house music',
      'techno': 'techno electronic',
      'ambient': 'ambient chill',
      'latin': 'latin pop',
      'world': 'world music',
      'gospel': 'gospel music'
    };

    const searchQuery = genreQueries[genre.toLowerCase()] || `${genre} music`;
    return this.searchTracks(searchQuery, limit);
  }

  async getTracksByDecade(decade, limit = 50) {
    const decadeQueries = {
      1960: '60s hits classics oldies',
      1970: '70s hits disco rock',
      1980: '80s hits new wave synth',
      1990: '90s hits grunge pop',
      2000: '2000s hits pop rock',
      2010: '2010s hits pop electronic',
      2020: '2020s hits current'
    };

    const searchQuery = decadeQueries[decade] || `${decade}s hits music`;
    return this.searchTracks(searchQuery, limit);
  }

  async getPopularTracks(limit = 50) {
    return this.searchTracks('top hits chart popular', limit);
  }
}

export default new DeezerService();