import Script from '../Private/Script.js';
import SpotifyArtistTrackerError from '../../Private/Error.js';

class RemoveArtistsWithoutServersScript extends Script {
  override async execute() {
    console.other('Running Remove Artists Without Servers Script');
    const artists = await this.scriptManager.Application.mongo.artist.getItems();
    if (!artists.success || artists.data === null) {
      throw new SpotifyArtistTrackerError("Something wen't wrong getting the artists");
    }
    for (const artist of artists.data) {
      if (artist.servers.length > 0) continue;
      const deleteArtist = await this.scriptManager.Application.mongo.artist.deleteItem(artist.id);
      if (!deleteArtist.success || deleteArtist.data !== null) {
        throw new SpotifyArtistTrackerError("Something wen't wrong deleting the artist");
      }
    }
  }
}

export default RemoveArtistsWithoutServersScript;
