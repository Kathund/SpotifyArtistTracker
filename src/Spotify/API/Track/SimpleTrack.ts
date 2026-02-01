import ExternalURLs from '../ExternalURLs.js';
import Restrictions from '../Restrictions.js';
import SimpleArtist from '../Artist/SimpleArtist.js';
import TrackLinked from './TrackLinked.js';

class SimpleTrack {
  artists: SimpleArtist[];
  availableMarkets: string[];
  discNumber: number;
  durationMs: number;
  explicit: boolean;
  externalURLs: ExternalURLs;
  href: string;
  id: string;
  isPlayable: boolean;
  linkedFrom: TrackLinked;
  restrictions: Restrictions;
  name: string;
  previewUrl: string | null;
  trackNumber: number;
  type: 'track';
  uri: string;
  isLocal: boolean;
  constructor(data: Record<string, any>) {
    this.artists = data.artists.map((artistData: Record<string, any>) => new SimpleArtist(artistData));
    this.availableMarkets = data.available_markets;
    this.discNumber = data.disc_number;
    this.durationMs = data.duration_ms;
    this.explicit = data.explicit;
    this.externalURLs = new ExternalURLs(data.external_urls);
    this.href = data.href;
    this.id = data.id;
    this.isPlayable = data.is_playable;
    this.linkedFrom = new TrackLinked(data.linked_from);
    this.restrictions = new Restrictions(data.restrictions);
    this.name = data.name;
    this.previewUrl = data.preview_url;
    this.trackNumber = data.track_number;
    this.type = data.type;
    this.uri = data.uri;
    this.isLocal = data.is_local;
  }

  toString(): string {
    return this.name;
  }
}

export default SimpleTrack;
