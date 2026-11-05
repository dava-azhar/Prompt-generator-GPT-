import { SlashCommand } from '../types/command';
import { SEED_COMMANDS_PART_1 } from './seedPart1';
import { SEED_COMMANDS_PART_2 } from './seedPart2';

export const ALL_SEED_COMMANDS: SlashCommand[] = [
  ...SEED_COMMANDS_PART_1,
  ...SEED_COMMANDS_PART_2,
];

export function getCommandsByCategory(categorySlug: string): SlashCommand[] {
  return ALL_SEED_COMMANDS.filter((cmd) => cmd.category.toLowerCase() === categorySlug.toLowerCase());
}

export function getCommandById(id: string): SlashCommand | undefined {
  return ALL_SEED_COMMANDS.find((cmd) => cmd.commandId === id);
}
