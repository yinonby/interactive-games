
import type { LevelExposedConfigT } from '@ig/games-engine-models';
import type { SchemaDefinition } from 'mongoose';

export const levelConfigSchemaDef: SchemaDefinition<LevelExposedConfigT> = {
  levelName: {
    type: String,
    required: false,
  },
}
