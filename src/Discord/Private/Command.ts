/* eslint-disable require-await */

import { CommandType } from '../../Types/Discord.js';
import type CommandData from './CommandData.js';
import type DiscordManager from '../DiscordManager.js';
import type { AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';

class Command {
  readonly discord: DiscordManager;
  data!: CommandData;
  type: CommandType;
  constructor(discord: DiscordManager) {
    this.discord = discord;
    this.type = CommandType.General;
  }

  async autocomplete(interaction: AutocompleteInteraction) {
    throw new Error('Execute Method not implemented!');
  }

  async execute(interaction: ChatInputCommandInteraction) {
    throw new Error('Execute Method not implemented!');
  }
}

export default Command;
