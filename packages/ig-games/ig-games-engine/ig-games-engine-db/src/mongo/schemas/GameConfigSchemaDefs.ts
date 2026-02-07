
import type { GameConfigT, GameInfoNoIdT, MinimalGameInfoNoIdT } from '@ig/games-engine-models';
import type { SchemaDefinition } from 'mongoose';
import { durationInfoSchemaDef, imageInfoSchemaDef, priceInfoSchemaDef } from './CommonSchemaDefs';
import { levelConfigSchemaDef } from './LevelConfigSchemaDefs';

export const minimalGameInfoNoIdSchemaDef: SchemaDefinition<MinimalGameInfoNoIdT> = {
  kind: {
    type: String,
    required: true,
    enum: ['jointGame'],
  },

  gameName: {
    type: String,
    required: true,
    trim: true,
  },

  maxDurationInfo: {
    type: durationInfoSchemaDef,
    _id: false,
    required: true,
  },

  gamePriceInfo: {
    type: priceInfoSchemaDef,
    _id: false,
    required: true,
  },

  maxParticipants: {
    type: Number,
    required: true,
    min: 1,
  },

  imageInfo: {
    type: imageInfoSchemaDef,
    _id: false,
    required: true,
  },
}

export const gameInfoNoIdSchemaDef: SchemaDefinition<GameInfoNoIdT> = {
  ...minimalGameInfoNoIdSchemaDef,

  extraTimeMinutes: {
    type: Number,
    required: true,
    min: 0,
  },

  extraTimeLimitDurationInfo: {
    type: durationInfoSchemaDef,
    _id: false,
    required: true,
  },

  levelExposedConfigs: {
    type: [levelConfigSchemaDef],
    _id: false,
    required: true,
    default: [],
  },
}

export const gameConfigSchemaDef: SchemaDefinition<GameConfigT> = {
  gameConfigId: {
    type: String,
    required: true,
  },

  gameInfoNoId: {
    type: gameInfoNoIdSchemaDef,
    _id: false,
    required: true,
  },
}
