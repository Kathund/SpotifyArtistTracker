import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import SpotifyArtistTrackerError from '../../Private/Error.js';
import { type AutocompleteInteraction, ChannelType, type ChatInputCommandInteraction } from 'discord.js';
import type DiscordManager from '../DiscordManager.js';

class TrackArtist extends Command {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new CommandData()
      .setName('track-artist')
      .setDescription("Track an artist's music and when they release new stuff")
      .addStringOption((option) =>
        option.setName('artist').setDescription('artist').setAutocomplete(true).setRequired(true)
      )
      .addChannelOption((option) =>
        option
          .setName('channel')
          .setDescription('The channel for alerts')
          .setRequired(true)
          .addChannelTypes(
            ChannelType.GuildText,
            ChannelType.GuildAnnouncement,
            ChannelType.PublicThread,
            ChannelType.PrivateThread
          )
      );
  }

  override async autocomplete(interaction: AutocompleteInteraction) {
    const focusedOption = interaction.options.getFocused(true);
    let choices: string[];
    switch (focusedOption.name) {
      case 'artist': {
        if (focusedOption.value === '') {
          choices = [];
          break;
        }
        const artists = await this.discord.Application.spotify.requestHandler.searchArtist(focusedOption.value);
        choices =
          artists.artist.items.length > 0 ? artists.artist.items.map((artist) => `${artist.name} - ${artist.id}`) : [];
        break;
      }
      default: {
        choices = ['Something went wrong - Something went wrong'];
        break;
      }
    }

    await interaction.respond(choices.map((choice) => ({ name: choice, value: choice.split(' - ')?.[1] ?? 'all' })));
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (interaction.guild === null) throw new SpotifyArtistTrackerError('This command must be used in a guild');
    const artistId = interaction.options.getString('artist') ?? undefined;
    if (artistId === undefined) throw new SpotifyArtistTrackerError('What? Why did you not put an artist');
    const channelInput = interaction.options.getChannel('channel') ?? undefined;
    if (channelInput === undefined) throw new SpotifyArtistTrackerError('What? Why did you not put an channel');
    const channel = await interaction.client.channels.fetch(channelInput.id);
    const artist = await this.discord.Application.spotify.requestHandler.getArtist(artistId);
    if (channel === undefined || channel === null || !channel.isSendable()) {
      throw new SpotifyArtistTrackerError("Channel doesn't exist");
    }
    const saveData = await this.discord.Application.mongo.artist.addServerToArtist(
      { name: artist.name, id: artist.id },
      { id: interaction.guild.id, channel: channel.id }
    );
    if (!saveData.success) throw new SpotifyArtistTrackerError("Something wen't wrong saving your guild's data");
    await channel.send({ embeds: [artist.toEmbed().setTitle('Now tracking new music')] });
    await interaction.followUp({ content: `Now tracking ${artist.name} in <#${channel.id}>` });
  }
}

export default TrackArtist;
