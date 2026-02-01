import SpotifyArtistTrackerError from '../../Private/Error.js';
import {
  AutocompleteInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  MessageFlags,
  StringSelectMenuInteraction,
  Team
} from 'discord.js';
import { ErrorEmbed } from './Embed.js';
import type DiscordManager from '../DiscordManager.js';

class DiscordUtils {
  readonly discord: DiscordManager;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  private getErrorEmbed(error: Error | SpotifyArtistTrackerError): ErrorEmbed {
    const errorStack = error.stack ?? error ?? 'Unknown';
    return new ErrorEmbed().setDescription(`\`\`\`${errorStack}\`\`\``);
  }

  private async logError(error: Error | SpotifyArtistTrackerError) {
    if (!this.discord.client || !this.discord.client.application) return;
    if (error instanceof SpotifyArtistTrackerError === false) {
      const app = await this.discord.client.application.fetch();
      const users: string[] =
        app.owner instanceof Team === true ? app.owner.members.map((member) => member.id) : [app.owner?.id as string];
      const channel = await this.discord.client.channels.fetch(process.env.LOGS_CHANNEL);
      if (channel && channel.isSendable()) {
        await channel.send({
          content: users.map((user) => `<@${user}>`).join(' '),
          embeds: [this.getErrorEmbed(error)]
        });
      }
    }
  }

  async handleError(
    error: Error | SpotifyArtistTrackerError,
    interaction:
      | ChatInputCommandInteraction
      | ButtonInteraction
      | AutocompleteInteraction
      | StringSelectMenuInteraction
      | null = null
  ) {
    console.error(error);
    this.logError(error);
    if (interaction === null) return;
    const embed = new ErrorEmbed().setDescription('This error has been reported to the owner. Please try again later.');
    if (error instanceof SpotifyArtistTrackerError) embed.setDescription(`\`\`\`${error.message}\`\`\``);
    if (!interaction.isAutocomplete()) {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } else {
        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      }
      if (error instanceof SpotifyArtistTrackerError === false) {
        await interaction.followUp({ embeds: [this.getErrorEmbed(error)], flags: MessageFlags.Ephemeral });
      }
    }
  }
}

export default DiscordUtils;
