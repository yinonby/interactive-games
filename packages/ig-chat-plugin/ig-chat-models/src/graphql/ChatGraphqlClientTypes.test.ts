
import { buildSchema, parse, print, validate } from 'graphql';
import {
  createChatMessageMutation,
  getMostRecentChatMessagesQuery, getNextChatMessagesQuery, getPreviousChatMessagesQuery
} from './ChatGraphqlClientTypes';
import { chatMessageGraphqlTypeDefs } from './ChatGraphqlTypeDefs';

describe('ChatMessageGraphqlClientTypes', () => {
  const sdl = print(chatMessageGraphqlTypeDefs);
  const schema = buildSchema(sdl);

  it('client getMostRecentChatMessagesQuery is valid against the GraphQL schema', () => {
    const document = parse(getMostRecentChatMessagesQuery);
    const errors = validate(schema, document);

    expect(errors).toHaveLength(0);
  });

  it('client getPreviousChatMessagesQuery is valid against the GraphQL schema', () => {
    const document = parse(getPreviousChatMessagesQuery);
    const errors = validate(schema, document);

    expect(errors).toHaveLength(0);
  });

  it('client getNextChatMessagesQuery is valid against the GraphQL schema', () => {
    const document = parse(getNextChatMessagesQuery);
    const errors = validate(schema, document);

    expect(errors).toHaveLength(0);
  });

  it('client createChatMessageMutation is valid against the GraphQL schema', () => {
    const document = parse(createChatMessageMutation);
    const errors = validate(schema, document);

    expect(errors).toHaveLength(0);
  });
});
