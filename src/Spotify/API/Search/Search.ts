import Artist from '../Artist/Artist.js';
import SearchResults from './SearchResults.js';

class Search {
  artist: SearchResults<Artist>;
  constructor(data: Record<string, any>) {
    this.artist = new SearchResults<Artist>(data.artists, Artist);
  }
}

export default Search;
