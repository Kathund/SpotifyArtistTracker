import { Collection } from 'discord.js';
import type Button from '../Discord/Private/Button.js';
import type Command from '../Discord/Private/Command.js';
import type StringSelect from '../Discord/Private/StringSelect.js';

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, Command>;
    buttons: Collection<string, Button>;
    stringSelect: Collection<string, StringSelect>;
  }
}
