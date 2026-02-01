import { EmbedBuilder } from 'discord.js';

class Embed extends EmbedBuilder {
  constructor() {
    super();
    this.setTimestamp();
    this.setColor('#ff538e');
    this.setFooter({ text: 'Spotify Artist Tracker by @.kathund', iconURL: 'https://i.imgur.com/uUuZx2E.png' });
  }
}

export class ErrorEmbed extends Embed {
  constructor() {
    super();
    this.setAuthor({ name: 'Something went wrong' });
    this.setColor(15548997);
  }
}

export default Embed;
