
import { buildSchema, print } from 'graphql';
import { gamesGraphqlCommonTypeDefs } from './GamesGraphqlCommonTypeDefs';

describe('GamesGraphqlCommonTypeDefs', () => {
  const sdl = print(gamesGraphqlCommonTypeDefs);

  it('should build executable schema without errors', () => {
    expect(() => buildSchema(sdl)).not.toThrow();
  });
});
