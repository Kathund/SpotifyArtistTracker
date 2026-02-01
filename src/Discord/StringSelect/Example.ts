import StringSelect from '../Private/StringSelect.js';
import StringSelectData from '../Private/StringSelectData.js';
import type DiscordManager from '../DiscordManager.js';
import type { StringSelectMenuInteraction } from 'discord.js';

class ExampleStringSelect extends StringSelect {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new StringSelectData('example');
  }

  override async execute(interaction: StringSelectMenuInteraction): Promise<void> {
    await interaction.followUp({ content: 'meow' });
  }
}

export default ExampleStringSelect;
