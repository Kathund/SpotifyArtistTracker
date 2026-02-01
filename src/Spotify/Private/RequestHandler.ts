import Album from '../API/Album/Album.js';
import Artist from '../API/Artist/Artist.js';
import Search from '../API/Search/Search.js';
import SearchResults from '../API/Search/SearchResults.js';
import SimpleAlbum from '../API/Album/SimpleAlbum.js';
import { chunkArray } from '../../Utils/MiscUtils.js';
import type SpotifyManager from '../SpotifyManager.js';

class RequestHandler {
  readonly spotify: SpotifyManager;
  constructor(spotify: SpotifyManager) {
    this.spotify = spotify;
  }

  async getAlbums(query: string[]): Promise<Album[]> {
    const albums: Album[] = [];
    const chunks = chunkArray<string>(query, 20);
    for (const chunk of chunks) {
      const res = await this.spotify.Application.requestHandler.request(`/albums?ids=${chunk.join(',')}`);
      const parsedAlbums = res.data.albums.map((album: Record<string, any>) => new Album(album));
      albums.push(...parsedAlbums);
    }
    return albums;
  }

  async getAlbum(query: string): Promise<Album> {
    const res = await this.spotify.Application.requestHandler.request(`/albums/${query}`);
    return new Album(res.data);
  }

  async getArtistAlbums(query: string): Promise<SimpleAlbum[]> {
    let albums: SimpleAlbum[] = [];
    let nextUrl: string | null = `/artists/${query}/albums?limit=50&include_groups=album,single,appears_on,compilation`;

    while (nextUrl) {
      const res = await this.spotify.Application.requestHandler.request(nextUrl);
      const searchResults = new SearchResults<SimpleAlbum>(res.data, SimpleAlbum);
      albums = [...albums, ...searchResults.items];
      nextUrl = searchResults.next;
    }

    return albums;
  }

  async getArtist(query: string): Promise<Artist> {
    const res = await this.spotify.Application.requestHandler.request(`/artists/${query}`);
    return new Artist(res.data);
  }

  async searchArtist(query: string, page: number = 0): Promise<Search> {
    const offset = page * 10;
    const res = await this.spotify.Application.requestHandler.request(
      `/search?type=artist&limit=10&q=${query.replaceAll('%20', '+')}&offset=${offset}`
    );
    return new Search(res.data);
  }
}

export default RequestHandler;
