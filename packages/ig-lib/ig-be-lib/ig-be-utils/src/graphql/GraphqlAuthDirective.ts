
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import type { GraphQLSchema } from 'graphql';
import { defaultFieldResolver } from 'graphql';

export type GraphqlSchemaTransformerT = (schema: GraphQLSchema) => GraphQLSchema;

export const makeGraphqlAuthDirectiveTransformer = (
  directiveName: string,
  userHasRoleFn: (token: string, requiredRole: string) => boolean,
): GraphqlSchemaTransformerT => {
  return (schema: GraphQLSchema): GraphQLSchema => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const typeDirectiveArgumentMaps: Record<string, any> = {}

    return mapSchema(schema, {
      [MapperKind.TYPE]: type => {
        const authDirective = getDirective(schema, type, directiveName)?.[0]
        if (authDirective) {
          // if this type has this directive in the SDL, mark it on the map
          typeDirectiveArgumentMaps[type.name] = authDirective;
        }
        return undefined
      },
      [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
        // if this field, or its type, have this directive in the SDL
        const authDirective =
          getDirective(schema, fieldConfig, directiveName)?.[0] ??
          typeDirectiveArgumentMaps[typeName];

        if (authDirective) {
          const { requires } = authDirective;
          if (requires) {
            const { resolve = defaultFieldResolver } = fieldConfig;
            fieldConfig.resolve = function (source, args, context, info): ReturnType<typeof resolve> {
              const hasRole = userHasRoleFn(context.headers.authToken, requires);
              if (!hasRole) {
                throw new Error('not authorized');
              }
              return resolve(source, args, context, info);
            }
            return fieldConfig;
          }
        }
      }
    })
  }
}
