
import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { makeGraphqlAuthDirectiveTransformer } from './GraphqlAuthDirective';

describe('GraphqlAuthDirective', () => {
  const directiveName = 'auth';

  // mock function for role checking
  const getUserHasRoleFn = (token: string, requiredRole: string): boolean => {
    if (token === 'valid-token' && requiredRole === 'gamesSystemAdmin') return true;
    return false;
  };

  const authDirectiveGraphqlTransformer = makeGraphqlAuthDirectiveTransformer(directiveName, getUserHasRoleFn);

  // build a schema with a field using the directive
  const typeDefsSdl = `
    directive @${directiveName}(
      requires: Role,
    ) on OBJECT | FIELD_DEFINITION

    enum Role {
      gamesSystemAdmin
    }

    type Query {
      secretData: String @${directiveName}(requires: gamesSystemAdmin)
      publicData: String
      nestedWithSecret: NestedWithSecret
      secretObject: SecretObject
      badDirectivePublicData: String @${directiveName}
    }

    type NestedWithSecret {
      nestedPublicData: String
      nestedSecretData: String @${directiveName}(requires: gamesSystemAdmin)
    }

    type SecretObject @${directiveName}(requires: gamesSystemAdmin) {
      secretObjectData: String
    }
  `;

  let schema = makeExecutableSchema({
    typeDefs: typeDefsSdl,
    resolvers: {
      Query: {
        secretData: () => 'top-secret',
        publicData: () => 'hello',
        nestedWithSecret: () => ({ nestedPublicData: 'nestedPublicData', nestedSecretData: 'nestedSecretData' }),
        secretObject: () => ({ secretObjectData: 'secretObjectData' }),
        badDirectivePublicData: () => 'badDirectivePublicData',
      },
    },
  });
  schema = authDirectiveGraphqlTransformer(schema);
  let server: ApolloServer;

  beforeAll(async () => {
    server = new ApolloServer({
      schema,
    });

    await server.start();
  });

  it('allows access if user has role', async () => {
    const query = `{ secretData }`;

    const result = await server.executeOperation({
      query,
    }, {
      contextValue: {
        headers: { authToken: 'valid-token' },
      },
    });

    assert(result.body.kind === 'single');
    expect(result.body.singleResult.errors).toBeUndefined();
    expect(result.body.singleResult.data?.secretData).toBe('top-secret');
  });

  it('denies access if user does not have role', async () => {
    const query = `{ secretData }`;

    const result = await server.executeOperation({
      query,
    }, {
      contextValue: {
        headers: { authToken: 'invalid-token' },
      },
    });

    assert(result.body.kind === 'single');
    expect(result.body.singleResult.errors).toHaveLength(1);
    expect(result.body.singleResult.errors?.[0].message).toBe('not authorized');
    expect(result.body.singleResult.data?.secretData).toBeNull();
  });

  it('allows access to fields without the directive', async () => {
    const query = `{ publicData }`;

    const result = await server.executeOperation({
      query,
    }, {
      contextValue: {
        headers: { authToken: 'invalid-token' },
      },
    });

    assert(result.body.kind === 'single');
    expect(result.body.singleResult.errors).toBeUndefined();
    expect(result.body.singleResult.data?.publicData).toBe('hello');
  });

  it('allows access to nested secret fields if user has role', async () => {
    const query = `{
      nestedWithSecret {
        nestedSecretData
      }
    }`;

    type Result = {
      nestedWithSecret: {
        nestedSecretData: string,
      },
    };

    const result = await server.executeOperation<Result>({
      query,
    }, {
      contextValue: {
        headers: { authToken: 'valid-token' },
      },
    });

    assert(result.body.kind === 'single');
    expect(result.body.singleResult.errors).toBeUndefined();
    expect(result.body.singleResult.data?.nestedWithSecret?.nestedSecretData).toBe('nestedSecretData');
  });

  it('denies access to nested secret fields if user does not have role', async () => {
    const query = `{
      nestedWithSecret {
        nestedPublicData
        nestedSecretData
      }
    }`;

    type Result = {
      nestedWithSecret: {
        nestedPublicData: string,
        nestedSecretData: string,
      },
    };

    const result = await server.executeOperation<Result>({
      query,
    }, {
      contextValue: {
        headers: { authToken: 'invalid-token' },
      },
    });

    assert(result.body.kind === 'single');
    expect(result.body.singleResult.errors).toHaveLength(1);
    expect(result.body.singleResult.errors?.[0].message).toBe('not authorized');
    expect(result.body.singleResult.data?.nestedWithSecret?.nestedPublicData).toBe('nestedPublicData');
    expect(result.body.singleResult.data?.nestedWithSecret?.nestedSecretData).toBeNull();
  });

  it('allows access to fields within a secret object if user has role', async () => {
    const query = `{
      secretObject {
        secretObjectData
      }
    }`;

    type Result = {
      secretObject: {
        secretObjectData: string,
      },
    };

    const result = await server.executeOperation<Result>({
      query,
    }, {
      contextValue: {
        headers: { authToken: 'valid-token' },
      },
    });

    assert(result.body.kind === 'single');
    expect(result.body.singleResult.errors).toBeUndefined();
    expect(result.body.singleResult.data?.secretObject?.secretObjectData).toBe('secretObjectData');
  });

  it('denies access to fields within a secret object if user does not have role', async () => {
    const query = `{
      secretObject {
        secretObjectData
      }
    }`;

    type Result = {
      secretObject: {
        secretObjectData: string,
      },
    };

    const result = await server.executeOperation<Result>({
      query,
    }, {
      contextValue: {
        headers: { authToken: 'invalid-token' },
      },
    });

    assert(result.body.kind === 'single');
    expect(result.body.singleResult.errors).toHaveLength(1);
    expect(result.body.singleResult.errors?.[0].message).toBe('not authorized');
    expect(result.body.singleResult.data?.secretObject.secretObjectData).toBeNull();
  });

  it('allows access to fields where directive is missing requires', async () => {
    const query = `{ badDirectivePublicData }`;

    const result = await server.executeOperation({
      query,
    }, {
      contextValue: {
        headers: { authToken: 'invalid-token' },
      },
    });

    assert(result.body.kind === 'single');
    expect(result.body.singleResult.errors).toBeUndefined();
    expect(result.body.singleResult.data?.badDirectivePublicData).toBe('badDirectivePublicData');
  });
});
