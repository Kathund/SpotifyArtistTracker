import type CommandData from './CommandData.js';
import type DiscordManager from '../DiscordManager.js';
import type { AutocompleteInteraction, ButtonInteraction, ChatInputCommandInteraction } from 'discord.js';

class Command {
  readonly discord: DiscordManager;
  data!: CommandData;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  autocomplete(interaction: AutocompleteInteraction) {
    throw new Error('Execute Method not implemented!');
  }

  execute(interaction: ChatInputCommandInteraction | ButtonInteraction) {
    throw new Error('Execute Method not implemented!');
  }
}

export default Command;
