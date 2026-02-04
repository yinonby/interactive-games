import type { ImageInfoT } from './CommonTypes'

export type LevelExposedConfigT = {
  levelName?: string,
} & ({
  kind: 'wordle',
  wordlePuzzleExposedConfig: WordlePuzzleExposedConfigT
} | {
  kind: 'code',
  codePuzzleExposedConfig: CodePuzzleExposedConfigT
})

export type WordlePuzzleExposedConfigT = {
  wordLength: number,
}

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
