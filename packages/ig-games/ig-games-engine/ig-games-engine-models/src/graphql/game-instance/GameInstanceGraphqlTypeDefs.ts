
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

  enum PluginKindEnum {
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

  enum WordleDifficultyEnum {
    easy
    medium
    hard
  }
`;

export const gameInstanceGraphqlTypesTypeDefs = gql`
  type PublicPlayerInfo {
    playerId: ID!
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
    difficulty: WordleDifficultyEnum!
    allowedGuessesNum: Int!
  }

  type PublicWordleState {
    guessDatas: [WordleGuessData!]!
    correctGuess: String
  }

  type LevelState {
    levelStatus: LevelStatusEnum!
    startTimeTs: Float
    solvedTimeTs: Float

    pluginState: PluginState!
  }

  type PluginState {
    kind: PluginKindEnum!

    publicCodePuzzleConfig: PublicCodePuzzleConfig
    codeSolution: String
    isCaseSensitive: Boolean

    publicWordleConfig: PublicWordleConfig
    publicWordleState: PublicWordleState
    wordleSolution: String
  }


  type GameState {
    gameStatus: GameStatusEnum!
    startTimeTs: Float
    lastGivenExtraTimeTs: Float
    finishTimeTs: Float
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
  input CreateGameInstanceInput {
    gameConfigId: ID!
  }

  type CreateGameInstanceResult {
    gameInstanceId: ID!
  }

  input JoinGameByInviteInput {
    invitationCode: String!
  }

  type JoinGameByInviteResult {
    gameInstanceId: ID!
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
    getGameInstanceIdsForGameConfig(gameConfigId: ID!): [ID!]!
    getPublicGameInstance(gameInstanceId: ID!): PublicGameInstance!
  }
`;

const gameInstanceGraphqlMutationTypeDefs = gql`
  type Mutation {
    createGameInstance(input: CreateGameInstanceInput!): CreateGameInstanceResult!
    joinGameByInvite(input: JoinGameByInviteInput!): JoinGameByInviteResult!
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
