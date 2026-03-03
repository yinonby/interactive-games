
import {
  type GameInstanceT, type GameStateT, type LevelStateT, type PublicPlayerInfoT
} from '@ig/games-engine-models';
import { Schema, type SchemaDefinition } from 'mongoose';
import { publicGameConfigSchemaDef } from './GameConfigSchemaDefs';

const levelStateSchemaDef: SchemaDefinition<LevelStateT> = {
  levelStatus: {
    type: String,
    required: true,
    enum: ['notStarted', 'levelInProcess', 'solved', 'failed'],
  },

  startTimeTs: {
    type: Number,
    required: false,
  },

  solvedTimeTs: {
    type: Number,
    required: false,
  },

  pluginState: {
    type: Schema.Types.Mixed,
    required: true,
  },
}

export const publicPlayerInfoSchemaDef: SchemaDefinition<PublicPlayerInfoT> = {
  playerId: {
    type: String,
    required: true,
  },

  playerNickname: {
    type: String,
    required: true,
  },

  playerRole: {
    type: String,
    required: true,
    enum: ['admin', 'player'],
  },

  playerStatus: {
    type: String,
    required: true,
    enum: ['invited', 'active', 'suspended'],
  },
}

export const gameStateSchemaDef: SchemaDefinition<GameStateT> = {
  gameStatus: {
    type: String,
    required: true,
    enum: ['notStarted', 'inProcess', 'ended'],
  },

  startTimeTs: {
    type: Number,
    required: false,
  },

  lastGivenExtraTimeTs: {
    type: Number,
    required: false,
  },

  finishTimeTs: {
    type: Number,
    required: false,
  },

  levelStates: {
    type: [levelStateSchemaDef],
    _id: false,
    required: true,
  }
}

export const gameInstanceSchemaDef: SchemaDefinition<GameInstanceT> = {
  gameInstanceId: {
    type: String,
    required: true,
  },

  invitationCode: {
    type: String,
    required: true,
  },

  publicGameConfig: {
    type: publicGameConfigSchemaDef,
    _id: false,
    required: true,
  },

  gameState: {
    type: gameStateSchemaDef,
    _id: false,
    required: true,
  },

  publicPlayerInfos: {
    type: [publicPlayerInfoSchemaDef],
    _id: false,
    required: true,
  },
}
