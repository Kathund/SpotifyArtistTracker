import Embed from '../../Discord/Private/Embed.js';
import Script from '../Private/Script.js';
import SpotifyArtistTrackerError from '../../Private/Error.js';
import { compareArrays } from '../../Utils/MiscUtils.js';
import type { Artist, ArtistAlbum, ServerArtist } from '../../Mongo/Private/Schemas.js';
import type { MongoReturnData } from '../../Types/Mongo.js';
import type { SendableChannels } from 'discord.js';

interface AlertChannel {
  channel: SendableChannels;
  role?: string | null | undefined;
}

class UpdateArtists extends Script {
  async updateArtist(artist: Artist): Promise<MongoReturnData<Artist>> {
    const artistAlbums = await this.scriptManager.Application.spotify.requestHandler.getArtistAlbums(artist.id);
    const fullAlbums = await this.scriptManager.Application.spotify.requestHandler.getAlbums(
      artistAlbums.map((album) => album.id)
    );
    const albums: ArtistAlbum[] = fullAlbums.map((album) => ({
      id: album.id,
      name: album.name,
      artists: album.artists.map((artist) => ({ id: artist.id, name: artist.name })),
      tracks: album.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        explicit: track.explicit,
        artists: track.artists.map((artist) => ({ id: artist.id, name: artist.name })),
        number: track.trackNumber
      })),
      type: album.type
    }));
    const newArtist: Artist = { id: artist.id, name: artist.name, servers: artist.servers, albums };
    await this.checkForChanges(artist, newArtist);
    return await this.scriptManager.Application.mongo.artist.saveItem(newArtist);
  }

  async checkForChanges(oldArtist: Artist, artist: Artist): Promise<void> {
    if (!this.scriptManager.Application.discord.client) return;
    const comparison = compareArrays<ArtistAlbum>(oldArtist.albums, artist.albums);
    const channels = await this.getChannels(oldArtist.servers);

    await this.notify(comparison.added, channels, true);
    await this.notify(comparison.removed, channels, false);
  }

  private async getChannels(servers: ServerArtist[]): Promise<AlertChannel[]> {
    if (!this.scriptManager.Application.discord.client) return [];
    const channels: AlertChannel[] = [];

    for (const server of servers) {
      const channel = await this.scriptManager.Application.discord.client.channels.fetch(server.channel);
      if (channel && channel.isSendable()) channels.push({ role: server.role, channel });
    }

    return channels;
  }

  private async notify(albums: ArtistAlbum[], channels: AlertChannel[], added: boolean) {
    if (albums.length === 0) return;

    for (const album of albums) {
      for (const channelData of channels) {
        await channelData.channel.send({
          content: channelData.role ? `<@&${channelData.role}>` : '',
          embeds: [
            new Embed()
              .setTitle(album.name)
              .setAuthor({ name: album.artists.map((artist) => artist.name).join(', ') })
              .addFields({
                name: 'Tracks',
                value: album.tracks.map((track) => `**${track.number}.** ${track.name}`).join('\n')
              })
              .setFooter({ text: `This album has been ${added ? 'added' : 'removed'}` })
          ]
        });
      }
    }
  }

  override async execute() {
    console.other('Running Update Artists Script');
    const artists = await this.scriptManager.Application.mongo.artist.getItems();
    if (!artists.success || artists.data === null) {
      throw new SpotifyArtistTrackerError("Something wen't wrong getting the artists");
    }
    for (const artist of artists.data) await this.updateArtist(artist);
  }
}

export default UpdateArtists;
