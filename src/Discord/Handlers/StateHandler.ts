import { ActivityType } from 'discord.js';
import type DiscordManager from '../DiscordManager.js';

class StateHandler {
  readonly discord: DiscordManager;
  constructor(discordManager: DiscordManager) {
    this.discord = discordManager;
  }

  async onReady() {
    if (!this.discord.client || !this.discord.client.user) return;
    console.discord(`Logged in as ${this.discord.client.user?.username} (${this.discord.client.user?.id})!`);
    this.discord.client.user.setActivity({ name: 'IANN DIOR!', type: ActivityType.Listening });
    await this.discord.buttonHandler.loadButtons();
    await this.discord.stringSelectHandler.loadStringSelect();
    console.discord('Client fully loaded');
  }
}

export default StateHandler;
