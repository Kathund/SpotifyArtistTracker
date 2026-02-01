import Button from '../Private/Button.js';
import ButtonData from '../Private/ButtonData.js';
import type DiscordManager from '../DiscordManager.js';
import type { ButtonInteraction } from 'discord.js';

class ExampleButton extends Button {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new ButtonData('example');
  }

  override async execute(interaction: ButtonInteraction): Promise<void> {
    await interaction.reply({ content: 'meow' });
  }
}

export default ExampleButton;
