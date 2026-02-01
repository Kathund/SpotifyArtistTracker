import Script from '../Private/Script.js';
import SpotifyArtistTrackerError from '../../Private/Error.js';

class RemoveInvalidServersScript extends Script {
  override async execute() {
    console.other('Running Remove Invalid Servers Script');
    if (!this.scriptManager.Application.discord.client) return;
    const artists = await this.scriptManager.Application.mongo.artist.getItems();
    if (!artists.success || artists.data === null) {
      throw new SpotifyArtistTrackerError("Something wen't wrong getting the artists");
    }
    for (const artist of artists.data) {
      for (const server of artist.servers) {
        const guild = await this.scriptManager.Application.discord.client.guilds
          .fetch(server.id)
          .catch(() => undefined);
        if (guild === undefined) {
          artist.servers = artist.servers.filter((s) => s.id !== server.id);
          continue;
        }
        const channel = await guild.channels.fetch(server.channel).catch(() => undefined);
        if (channel === null || channel === undefined || !channel.isSendable()) {
          artist.servers = artist.servers.filter((s) => s.id !== server.id);
          continue;
        }
        await channel.sendTyping().catch(() => {
          artist.servers = artist.servers.filter((s) => s.id !== server.id);
        });
      }
      const saveArtist = await this.scriptManager.Application.mongo.artist.saveItem(artist);
      if (!saveArtist.success || saveArtist.data === null) {
        throw new SpotifyArtistTrackerError("Something wen't wrong saving the artist");
      }
    }
  }
}

export default RemoveInvalidServersScript;
