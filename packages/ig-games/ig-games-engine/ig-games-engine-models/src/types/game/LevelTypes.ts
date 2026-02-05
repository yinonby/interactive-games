
import type { WordleExposedConfigT } from '@ig/games-wordle-models'
import type { ImageInfoT } from './CommonTypes'

export type LevelExposedConfigT = {
  levelName?: string,
} & ({
  kind: 'wordle',
  wordleExposedConfig: WordleExposedConfigT,
} | {
  kind: 'code',
  codePuzzleExposedConfig: CodePuzzleExposedConfigT
})

export type CodePuzzleExposedConfigT = {
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
