import Command from '../Private/Command.js';
import SpotifyArtistTrackerError from '../../Private/Error.js';
import { AutocompleteInteraction, ChatInputCommandInteraction, Collection, REST, Routes } from 'discord.js';
import { readdirSync } from 'node:fs';
import type DiscordManager from '../DiscordManager.js';

class CommandHandler {
  readonly discord: DiscordManager;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await interaction.deferReply();
      console.discord(
        `Interaction Event trigged by ${interaction.user.username} (${
          interaction.user.id
        }) ran command ${interaction.commandName}`
      );
      await command.execute(interaction);
    } catch (error) {
      if (error instanceof Error || error instanceof SpotifyArtistTrackerError) {
        this.discord.utils.handleError(error, interaction);
      }
    }
  }

  async onAutoComplete(interaction: AutocompleteInteraction): Promise<void> {
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.autocomplete(interaction);
    } catch (error) {
      if (error instanceof Error || error instanceof SpotifyArtistTrackerError) {
        this.discord.utils.handleError(error, interaction);
      }
    }
  }

  async deployCommands(): Promise<void> {
    if (!this.discord.client) return;
    this.discord.client.commands = new Collection<string, Command>();
    const commandFiles = readdirSync('./src/Discord/Commands');
    const commands = [];
    for (const file of commandFiles) {
      const command = new (await import(`../Commands/${file}`)).default(this.discord);
      if (command.data.name) {
        commands.push(command.data.toJSON());
        this.discord.client.commands.set(command.data.name, command);
      }
    }
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    const clientID = Buffer.from(process.env.DISCORD_TOKEN.split('.')?.[0] || 'UNKNOWN', 'base64').toString('ascii');
    await rest.put(Routes.applicationCommands(clientID), { body: commands });
    console.discord(`Successfully reloaded ${commands.length} application command(s).`);
  }
}

export default CommandHandler;
