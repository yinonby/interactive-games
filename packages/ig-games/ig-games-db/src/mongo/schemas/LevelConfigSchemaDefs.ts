
import type { LevelExposedConfigT } from '@ig/games-models';
import type { SchemaDefinition } from 'mongoose';

export const levelConfigSchemaDef: SchemaDefinition<LevelExposedConfigT> = {
  levelName: {
    type: String,
    required: false,
  },
}
