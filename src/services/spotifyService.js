const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

class SpotifyService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error('Missing Spotify credentials');
      throw new Error('Spotify API credentials not configured');
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Spotify API error:', response.status, errorData);
        throw new Error(`Failed to get access token: ${response.status}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      
      console.log('Successfully obtained Spotify access token');
      return this.accessToken;
    } catch (error) {
      console.error('Error getting Spotify access token:', error);
      throw error;
    }
  }

  async searchTracks(query, limit = 50) {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to search tracks');
      }

      const data = await response.json();
      return data.tracks.items;
    } catch (error) {
      console.error('Error searching tracks:', error);
      return [];
    }
  }

  async getPlaylistTracks(playlistId, limit = 50) {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get playlist tracks');
      }

      const data = await response.json();
      return data.items.map(item => item.track).filter(track => track && track.preview_url);
    } catch (error) {
      console.error('Error getting playlist tracks:', error);
      return [];
    }
  }

  async getGenreSeeds() {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get genre seeds');
      }

      const data = await response.json();
      return data.genres;
    } catch (error) {
      console.error('Error getting genre seeds:', error);
      return ['pop', 'rock', 'hip-hop', 'electronic', 'country', 'jazz', 'classical', 'r-n-b'];
    }
  }

  async getRecommendations(genres, limit = 50) {
    try {
      const token = await this.getAccessToken();
      const genreString = genres.slice(0, 5).join(','); // Spotify allows max 5 seed genres
      
      const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${genreString}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const data = await response.json();
      return data.tracks.filter(track => track.preview_url);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }

  // Get popular tracks from different decades
  async getTracksByDecade(decade, limit = 50) {
    const yearStart = decade;
    const yearEnd = decade + 9;
    
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(`https://api.spotify.com/v1/search?q=year:${yearStart}-${yearEnd}&type=track&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get tracks by decade');
      }

      const data = await response.json();
      return data.tracks.items.filter(track => track.preview_url);
    } catch (error) {
      console.error('Error getting tracks by decade:', error);
      return [];
    }
  }
}

export default new SpotifyService();