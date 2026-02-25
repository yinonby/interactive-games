
import { buildSchema, print } from 'graphql';
import { chatMessageGraphqlTypeDefs } from './ChatGraphqlTypeDefs';

describe('ChatMessageGraphqlTypeDefs', () => {
  const sdl = print(chatMessageGraphqlTypeDefs);

  it('should build executable schema without errors', () => {
    expect(() => buildSchema(sdl)).not.toThrow();
  });
});
