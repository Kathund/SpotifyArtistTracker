import Embed from '../../../Discord/Private/Embed.js';
import ExternalURLs from '../ExternalURLs.js';
import { StringSelectMenuOptionBuilder } from 'discord.js';

class SimpleArtist {
  externalURLs: ExternalURLs;
  href: string;
  id: string;
  name: string;
  type: 'artist';
  uri: string;
  constructor(data: Record<string, any>) {
    this.externalURLs = new ExternalURLs(data.external_urls);
    this.href = data.href;
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.uri = data.uri;
  }

  toString(): string {
    return this.name;
  }

  toEmbed(): Embed {
    return new Embed().setAuthor({
      name: this.toString(),
      url: this.externalURLs.spotify
    });
  }

  toStringSelectionOption() {
    return new StringSelectMenuOptionBuilder().setLabel(this.name).setValue(this.id);
  }
}

export default SimpleArtist;
