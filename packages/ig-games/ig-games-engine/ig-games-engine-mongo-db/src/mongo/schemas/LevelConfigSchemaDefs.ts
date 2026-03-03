
import type { LevelSolutionT, PublicLevelConfigT } from '@ig/games-engine-models';
import { Schema, type SchemaDefinition } from 'mongoose';

export const levelSolutionSchemaDef: SchemaDefinition<LevelSolutionT> = {
  kind: {
    type: String,
    required: true,
    enum: ['textSolution'],
  },
}

export const levelConfigSchemaDef: SchemaDefinition<PublicLevelConfigT> = {
  levelName: {
    type: String,
    required: false,
  },

  publicPluginConfig: {
    type: Schema.Types.Mixed,
    required: true,
  },
}
