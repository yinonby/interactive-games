
import type { PublicWordleConfigT } from '@ig/games-wordle-models'
import type { ImageInfoT } from './CommonTypes'

export type PublicLevelConfigT = {
  levelName?: string,
  publicPluginConfig: PublicCodeLevelConfigT | PublicWordleLevelConfigT,
}

export type PublicCodeLevelConfigT = {
  kind: 'code',
  publicCodePuzzleConfig: PublicCodePuzzleConfigT,
}

export type PublicWordleLevelConfigT = {
  kind: 'wordle',
  publicWordleConfig: PublicWordleConfigT,
}

export type PublicCodePuzzleConfigT = {
  kind: 'alphabetic' | 'numeric' | 'alphanumeric',
  codeLength: number,
  accessories?: CodePuzzleAccessoryT[],
  usedAccessories?: CodePuzzleAccessoryT[],
  instructions?: CodePuzzleInstructionT[],
}

export type CodePuzzleAccessoryT = {
  kind: 'image',
  imageInfo: ImageInfoT,
}

export type CodePuzzleInstructionT = {
  kind: 'text',
  text: string,
}

export type LevelSolutionT = {
  kind: 'textSolution',
};