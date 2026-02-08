import Command from '../../Private/Command.js';
import CommandData from '../../Private/CommandData.js';
import SpotifyArtistTrackerError from '../../../Private/Error.js';
import { TitleCase } from '../../../Utils/StringUtils.js';
import type DiscordManager from '../../DiscordManager.js';
import type { AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';

class DebugCommand extends Command {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new CommandData()
      .setName('debug')
      .setDescription('debug')
      .addSubcommand((option) =>
        option
          .setName('execute-script')
          .setDescription('execute a script')
          .addStringOption((option) =>
            option.setName('script').setDescription('the script').setAutocomplete(true).setRequired(true)
          )
      );
  }

  override async autocomplete(interaction: AutocompleteInteraction) {
    const focusedOption = interaction.options.getFocused(true);
    let choices: string[];
    switch (focusedOption.name) {
      case 'script': {
        choices = Object.keys(this.discord.Application.scripts)
          .filter((key) => key !== 'Application')
          .map((key) => `${TitleCase(key.replace(/([a-z0-9])([A-Z])/g, '$1 $2'))} - ${key}`);
        break;
      }
      default: {
        choices = ['Something went wrong - Something went wrong'];
        break;
      }
    }

    const userInput = focusedOption.value.toLowerCase();
    const filtered = choices.filter((choice) => choice.toLowerCase().startsWith(userInput)).slice(0, 24);

    if (userInput.length > 0 && !filtered.some((choice) => choice.toLowerCase() === userInput)) {
      filtered.push(focusedOption.value);
    }

    await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice.split(' - ')?.[1] ?? 'all' })));
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case 'execute-script': {
        const script = interaction.options.getString('script');
        if (!script) throw new SpotifyArtistTrackerError('You are missing a script?');
        if (!(script in this.discord.Application.scripts) || script === 'Application') {
          throw new SpotifyArtistTrackerError('Invalid script');
        }
        const name = script as Exclude<keyof typeof this.discord.Application.scripts, 'Application'>;
        await this.discord.Application.scripts[name].execute();
        await interaction.followUp({ content: `Running ${name}` });

        break;
      }
      default: {
        await interaction.followUp({ content: 'Something went wrong lol' });
        break;
      }
    }
    await interaction.followUp({
      content: `Online since <t:${Math.floor((Date.now() - interaction.client.uptime) / 1000)}:R>`
    });

    // console.time('updateArtists');
    // await this.discord.Application.scripts.updateArtists.execute();
    // console.timeEnd('updateArtists');
  }
}

export default DebugCommand;
