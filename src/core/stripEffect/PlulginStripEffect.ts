import { StripEffect } from './StripEffect'

export type PluginStripEffect = StripEffect & {
  type: 'Plugin';
  name: string;
};
