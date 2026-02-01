import SpotifyArtistTrackerError from '../../Private/Error.js';
import { Collection, StringSelectMenuInteraction } from 'discord.js';
import { readdirSync } from 'node:fs';
import type DiscordManager from '../DiscordManager.js';
import type StringSelect from '../Private/StringSelect.js';

class StringSelectHandler {
  private readonly discord: DiscordManager;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  async onStringSelect(interaction: StringSelectMenuInteraction): Promise<void> {
    const stringSelect = interaction.client.stringSelect.get(interaction.customId);
    if (!stringSelect) return;
    try {
      await interaction.deferUpdate();

      console.discord(
        `String Select Clicked ${interaction.user.username} (${interaction.user.id}) id ${interaction.customId} value ${
          interaction.values[0]
        }`
      );

      await stringSelect.execute(interaction);
    } catch (error) {
      if (error instanceof Error || error instanceof SpotifyArtistTrackerError) {
        this.discord.utils.handleError(error, interaction);
      }
    }
  }

  async loadStringSelect(): Promise<void> {
    if (!this.discord.client) return;
    this.discord.client.stringSelect = new Collection<string, StringSelect>();
    const stringSelectFiles = readdirSync('./src/Discord/StringSelect');
    for (const file of stringSelectFiles) {
      const stringSelect = new (await import(`../StringSelect/${file}`)).default(this.discord);
      this.discord.client.stringSelect.set(stringSelect.data.id, stringSelect);
    }
    console.discord(`Successfully loaded ${this.discord.client.stringSelect.size} String Select(s).`);
  }
}

export default StringSelectHandler;
