
import type { GameUserT } from '@ig/games-engine-models';
import { type SchemaDefinition } from 'mongoose';

export const gameUserSchemaDef: SchemaDefinition<GameUserT> = {
  gameUserId: {
    type: String,
    required: true,
  },

  joinedGameConfigIds: {
    type: [String],
    required: true,
  },
}
