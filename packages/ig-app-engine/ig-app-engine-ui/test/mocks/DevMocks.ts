
import type {
  GameInstanceExposedInfoT, MinimalPublicGameConfigT,
  PublicGameConfigT
} from '@ig/games-engine-models';
import { MIN_TO_MS } from '@ig/utils';

const secretIslandMinimalConfig: PublicGameConfigT = {
  gameConfigId: 'treasure-hunt-secret-island', // this game is already joined in this dev preset
  kind: 'jointGame',
  gameName: 'Treasure Hunt - Secret Island',
  maxDurationInfo: { kind: 'limited', durationMs: MIN_TO_MS(60) },
  gamePriceInfo: { kind: 'notFree', priceRate: 5, priceCurrency: 'EUR' },
  maxParticipants: 6,
  imageInfo: { kind: 'asset', imageAssetName: 'treasure-hunt-1' },

  // for full config
  extraTimeMinutes: 10,
  extraTimeLimitDurationInfo: { kind: 'limited', durationMs: MIN_TO_MS(20) },
  levelExposedConfigs: [],
}

const escapeRoomMinimalConfig: PublicGameConfigT = {
  gameConfigId: 'escape-room-harry-potter',
  kind: 'jointGame',
  gameName: 'Escape Room - Harry Potter',
  maxDurationInfo: { kind: 'unlimited' },
  gamePriceInfo: { kind: 'free' },
  maxParticipants: 6,
  imageInfo: { kind: 'asset', imageAssetName: 'escape-room-1' },

  // for full config
  extraTimeMinutes: 10,
  extraTimeLimitDurationInfo: { kind: 'unlimited' },
  levelExposedConfigs: [],
}

const wordleEnMinimalConfig: PublicGameConfigT = {
  gameConfigId: 'wordle-english',
  kind: 'jointGame',
  gameName: 'Wordle - English',
  maxDurationInfo: { kind: 'limited', durationMs: MIN_TO_MS(60) },
  gamePriceInfo: { kind: 'free' },
  maxParticipants: 6,
  imageInfo: { kind: 'asset', imageAssetName: 'wordle-1' },

  // for full config
  extraTimeMinutes: 10,
  extraTimeLimitDurationInfo: { kind: 'limited', durationMs: MIN_TO_MS(20) },
  levelExposedConfigs: [{
    kind: 'wordle',
    wordleExposedConfig: {
      wordLength: 5,
      allowedGuessesNum: 6,
      langCode: 'en',
    }
  }],
}

const wordleEsMinimalConfig: PublicGameConfigT = {
  gameConfigId: 'wordle-spanish',
  kind: 'jointGame',
  gameName: 'Wordle - Spanish',
  maxDurationInfo: { kind: 'limited', durationMs: MIN_TO_MS(60) },
  gamePriceInfo: { kind: 'free' },
  maxParticipants: 6,
  imageInfo: { kind: 'asset', imageAssetName: 'wordle-2' },

  // for full config
  extraTimeMinutes: 10,
  extraTimeLimitDurationInfo: { kind: 'limited', durationMs: MIN_TO_MS(20) },
  levelExposedConfigs: [],
}

const wordleFrMinimalConfig: PublicGameConfigT = {
  gameConfigId: 'wordle-french',
  kind: 'jointGame',
  gameName: 'Wordle - French',
  maxDurationInfo: { kind: 'limited', durationMs: MIN_TO_MS(60) },
  gamePriceInfo: { kind: 'free' },
  maxParticipants: 6,
  imageInfo: { kind: 'asset', imageAssetName: 'wordle-3' },

  // for full config
  extraTimeMinutes: 10,
  extraTimeLimitDurationInfo: { kind: 'limited', durationMs: MIN_TO_MS(20) },
  levelExposedConfigs: [],
}

export const devAvailableMinimalGameConfigs: MinimalPublicGameConfigT[] = [
  secretIslandMinimalConfig,
  escapeRoomMinimalConfig,
  wordleEnMinimalConfig,
  wordleEsMinimalConfig,
  wordleFrMinimalConfig,
]

export const devAllGameConfigs: PublicGameConfigT[] = [
  secretIslandMinimalConfig,
  escapeRoomMinimalConfig,
  wordleEnMinimalConfig,
  wordleEsMinimalConfig,
  wordleFrMinimalConfig,
]

export const devJoinedGameConfigs: PublicGameConfigT[] = [];

export const devAllGameInstanceExposedInfos: GameInstanceExposedInfoT[] = []
