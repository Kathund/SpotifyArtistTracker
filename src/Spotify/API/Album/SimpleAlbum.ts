import ExternalURLs from '../ExternalURLs.js';
import Image from '../Image.js';
import Restrictions from '../Restrictions.js';
import SimpleArtist from '../Artist/SimpleArtist.js';
import type { AlbumGroup, AlbumReleaseDatePrecision, AlbumType } from '../../../Types/Spotify.js';

class SimpleAlbum {
  albumType: AlbumType;
  totalTracks: number;
  availableMarkets: string[];
  externalURLs: ExternalURLs;
  href: string;
  id: string;
  images: Image[];
  name: string;
  releaseDate: string;
  releaseDatePrecision: AlbumReleaseDatePrecision;
  restrictions: Restrictions | null;
  type: 'album';
  uri: string;
  artists: SimpleArtist[];
  albumGroup: AlbumGroup;
  constructor(data: Record<string, any>) {
    this.albumType = data.album_type;
    this.totalTracks = data.total_tracks;
    this.availableMarkets = data.available_markets;
    this.externalURLs = new ExternalURLs(data?.external_urls);
    this.href = data.href;
    this.id = data.id;
    this.images = data.images.map((imageData: Record<string, any>) => new Image(imageData));
    this.name = data.name;
    this.releaseDate = data.release_date;
    this.releaseDatePrecision = data.release_date_precision;
    this.restrictions = data?.restrictions !== undefined ? new Restrictions(data.restrictions) : null;
    this.type = data.type;
    this.uri = data.uri;
    this.artists = data.artists.map((artistData: Record<string, any>) => new SimpleArtist(artistData));
    this.albumGroup = data.album_group;
  }

  toString(): string {
    return this.name;
  }
}

export default SimpleAlbum;
