
import { buildSchema, print } from 'graphql';
import { authGraphqlTypeDefs } from './AuthGraphqlTypeDefs';

describe('GameConfigGraphqlTypeDefs', () => {
  const sdl = print(authGraphqlTypeDefs);

  it('should build executable schema without errors', () => {
    expect(() => buildSchema(sdl)).not.toThrow();
  });
});
