import Command from '../Private/Command.js';
import SpotifyArtistTrackerError from '../../Private/Error.js';
import { AutocompleteInteraction, ChatInputCommandInteraction, Collection, REST, Routes } from 'discord.js';
import { CommandType } from '../../Types/Discord.js';
import { readdirSync } from 'node:fs';
import type DiscordManager from '../DiscordManager.js';
import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';

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

      if (command.type === CommandType.Dev) {
        const users: string[] = await this.discord.utils.getOwners();
        if (!users.includes(interaction.user.id)) {
          throw new SpotifyArtistTrackerError("You don't have permission to use this command");
        }
      }

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

    const generalCommands = await this.getGeneralCommands();
    const devCommands = await this.getDevCommands();

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    const clientID = Buffer.from(process.env.DISCORD_TOKEN.split('.')?.[0] || 'UNKNOWN', 'base64').toString('ascii');

    await rest
      .put(Routes.applicationCommands(clientID), { body: generalCommands })
      .then(() => console.discord(`Successfully reloaded ${generalCommands.length} application command(s).`));

    await rest
      .put(Routes.applicationGuildCommands(clientID, process.env.DEV_SERVER_ID), { body: devCommands })
      .then(() => console.discord(`Successfully reloaded ${devCommands.length} dev command(s).`));
  }

  private async getGeneralCommands(): Promise<RESTPostAPIChatInputApplicationCommandsJSONBody[]> {
    if (!this.discord.client) return [];

    const commandFiles = readdirSync('./src/Discord/Commands').filter((file) => file.endsWith('.ts'));
    const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

    for (const file of commandFiles) {
      const command: Command = new (await import(`../Commands/${file}`)).default(this.discord);
      if (command.data.name) {
        commands.push(command.data.toJSON());
        this.discord.client.commands.set(command.data.name, command);
      }
    }

    return commands;
  }

  private async getDevCommands(): Promise<RESTPostAPIChatInputApplicationCommandsJSONBody[]> {
    if (!this.discord.client) return [];

    const commandFiles = readdirSync('./src/Discord/Commands/Dev').filter((file) => file.endsWith('.ts'));
    const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

    for (const file of commandFiles) {
      const command: Command = new (await import(`../Commands/Dev/${file}`)).default(this.discord);
      command.type = CommandType.Dev;
      if (command.data.name) {
        commands.push(command.data.toJSON());
        this.discord.client.commands.set(command.data.name, command);
      }
    }

    return commands;
  }
}

export default CommandHandler;
