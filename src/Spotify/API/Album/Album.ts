import Copyright from '../Copyright.js';
import ExternalIds from '../ExternalIds.js';
import SearchResults from '../Search/SearchResults.js';
import SimpleAlbum from './SimpleAlbum.js';
import SimpleTrack from '../Track/SimpleTrack.js';

class Album extends SimpleAlbum {
  tracks: SearchResults<SimpleTrack>;
  copyrights: Copyright;
  externalIds: ExternalIds;
  genres: unknown[];
  label: string;
  popularity: number;
  constructor(data: Record<string, any>) {
    super(data);
    this.tracks = new SearchResults<SimpleTrack>(data.tracks, SimpleTrack);
    this.copyrights = new Copyright(data.copyrights);
    this.externalIds = new ExternalIds(data.external_ids);
    this.genres = data.genres;
    this.label = data.label;
    this.popularity = data.popularity;
  }
}

export default Album;
