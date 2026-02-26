
import { print } from 'graphql';
import { gql } from 'graphql-tag';
import { gamesGraphqlCommonTypeDefs, gamesGraphqlDirectiveTypeDefs } from '../common/GamesGraphqlCommonTypeDefs';
import { gameConfigGraphqlTypesTypeDefs } from '../game-config/GameConfigGraphqlTypeDefs';

export const gameInstanceGraphqlEnumsTypeDefs = gql`
  enum PlayerRoleEnum {
    admin
    player
  }

  enum PlayerStatusEnum {
    invited
    active
    suspended
  }

  enum GameStatusEnum {
    notStarted
    inProcess
    ended
  }

  enum LevelStatusEnum {
    notStarted
    levelInProcess
    solved
    ended
  }

  enum LevelKindEnum {
    code
    wordle
  }

  enum CodeKindEnum {
    alphabetic
    numeric
    alphanumeric
  }

  enum AccessoryKindEnum {
    image
  }

  enum InstructionKindEnum {
    text
  }

  enum LangCodeEnum {
    en
    es
    fr
  }

  enum LetterAnalysisEnum {
    hit
    present
    notPresent
  }

  enum SolutionKindEnum {
    text
  }
`;

export const gameInstanceGraphqlTypesTypeDefs = gql`
  type PublicPlayerInfo {
    playerAccountId: ID!
    playerNickname: String!
    playerRole: PlayerRoleEnum!
    playerStatus: PlayerStatusEnum!
  }

  type CodePuzzleAccessory {
    kind: AccessoryKindEnum!
    imageInfo: ImageInfo!
  }

  type CodePuzzleInstruction {
    kind: InstructionKindEnum!
    text: String!
  }

  type PublicCodePuzzleConfig {
    kind: CodeKindEnum!
    codeLength: Int!
    accessories: [CodePuzzleAccessory!]
    usedAccessories: [CodePuzzleAccessory!]
    instructions: [CodePuzzleInstruction!]
  }

  type WordleGuessData {
    guess: String!
    letterAnalyses: [LetterAnalysisEnum!]!
  }

  type PublicWordleConfig {
    langCode: LangCodeEnum!
    wordLength: Int!
    allowedGuessesNum: Int!
  }

  type PublicWordleState {
    guessDatas: [WordleGuessData!]!
    correctGuess: String
  }

  type LevelState {
    levelStatus: LevelStatusEnum!
    startTimeTs: Int
    solvedTimeTs: Int
    kind: LevelKindEnum!

    publicCodePuzzleConfig: PublicCodePuzzleConfig
    codeSolution: String

    publicWordleConfig: PublicWordleConfig
    publicWordleState: PublicWordleState
    wordleSolution: String
  }

  type GameState {
    gameStatus: GameStatusEnum!
    startTimeTs: Int!
    lastGivenExtraTimeTs: Int
    finishTimeTs: Int
    levelStates: [LevelState!]!
  }

  type PublicGameInstance {
    gameInstanceId: ID!
    invitationCode: String!
    publicGameConfig: PublicGameConfig!
    gameState: GameState!
    publicPlayerInfos: [PublicPlayerInfo!]!
  }
`;

export const gameInstanceGraphqlInputsTypeDefs = gql`
  input PublicPlayerInfoInput {
    playerAccountId: ID!
    playerNickname: String!
    playerRole: PlayerRoleEnum!
    playerStatus: PlayerStatusEnum!
  }

  input LevelSolutionInput {
    solutionKind: SolutionKindEnum!
  }

  input AddPlayerInput {
    gameInstanceId: ID!
    publicPlayerInfo: PublicPlayerInfoInput!
  }

  type AddPlayerResult {
    status: UpdateStatus!
  }

  input StartPlayingInput {
    gameInstanceId: ID!
  }

  type StartPlayingResult {
    status: UpdateStatus!
  }

  input SubmitGuessInput {
    gameInstanceId: ID!
    levelIdx: Int!
    guess: String!
  }

  type SubmitGuessResult {
    isGuessCorrect: Boolean!
  }
`;

const gameInstanceGraphqlQueryTypeDefs = gql`
  type Query {
    getGameConfigInstanceIds(gameConfigId: ID!): [ID!]!
    getPublicGameInstance(gameInstanceId: ID!): PublicGameInstance
  }
`;

const gameInstanceGraphqlMutationTypeDefs = gql`
  type Mutation {
    addPlayer(input: AddPlayerInput!): AddPlayerResult!
    startPlaying(input: StartPlayingInput!): StartPlayingResult!
    submitGuess(input: SubmitGuessInput!): SubmitGuessResult!
  }
`;

const gameInstanceGraphqlTypeDefsStr = [
  print(gamesGraphqlDirectiveTypeDefs),
  print(gamesGraphqlCommonTypeDefs),
  print(gameConfigGraphqlTypesTypeDefs),
  print(gameInstanceGraphqlEnumsTypeDefs),
  print(gameInstanceGraphqlTypesTypeDefs),
  print(gameInstanceGraphqlInputsTypeDefs),
  print(gameInstanceGraphqlQueryTypeDefs),
  print(gameInstanceGraphqlMutationTypeDefs),
].join('\n');

export const gameInstanceGraphqlTypeDefs = gql(gameInstanceGraphqlTypeDefsStr);
