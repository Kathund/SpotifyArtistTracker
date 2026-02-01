import StringSelectData from './StringSelectData.js';
import type DiscordManager from '../DiscordManager.js';
import type { StringSelectMenuInteraction } from 'discord.js';

class StringSelect {
  readonly discord: DiscordManager;
  data!: StringSelectData;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  execute(interaction: StringSelectMenuInteraction): Promise<void> | void {
    throw new Error('Execute Method not implemented!');
  }
}

export default StringSelect;
