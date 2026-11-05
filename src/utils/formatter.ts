import { SlashCommand } from '../types/command';

/**
 * Formats a SlashCommand into the official HarrisDev structured command format
 */
export function formatCommandOutput(cmd: Partial<SlashCommand>): string {
  const parts: string[] = [];

  const commandName = cmd.name?.startsWith('/') ? cmd.name : `/${cmd.name || 'command'}`;
  parts.push(commandName);
  parts.push('');

  if (cmd.role) {
    parts.push('Role:');
    parts.push(cmd.role.trim());
    parts.push('');
  }

  if (cmd.objective) {
    parts.push('Objective:');
    parts.push(cmd.objective.trim());
    parts.push('');
  }

  if (cmd.context) {
    parts.push('Context:');
    parts.push(cmd.context.trim());
    parts.push('');
  }

  if (cmd.instructions) {
    parts.push('Instructions:');
    parts.push(cmd.instructions.trim());
    parts.push('');
  }

  if (cmd.parameters) {
    parts.push('Parameters:');
    parts.push(cmd.parameters.trim());
    parts.push('');
  }

  if (cmd.outputFormat) {
    parts.push('Output Format:');
    parts.push(cmd.outputFormat.trim());
    parts.push('');
  }

  if (cmd.qualityControl) {
    parts.push('Quality Control:');
    parts.push(cmd.qualityControl.trim());
    parts.push('');
  }

  if (cmd.examples) {
    parts.push('Contoh Penggunaan:');
    parts.push(cmd.examples.trim());
    parts.push('');
  }

  parts.push('--- Powered by HarrisDev Studio | HarrisDev Official ---');

  return parts.join('\n').trim();
}

/**
 * Clean copy text ready to paste directly into ChatGPT/Claude
 */
export function formatForDirectPrompt(cmd: Partial<SlashCommand>): string {
  return formatCommandOutput(cmd);
}
