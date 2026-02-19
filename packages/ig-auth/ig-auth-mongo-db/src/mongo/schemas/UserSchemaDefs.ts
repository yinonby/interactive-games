
import type { UserT } from '@ig/auth-models';
import type { SchemaDefinition } from 'mongoose';

export const getUserSchemaDef = (): SchemaDefinition<UserT> => ({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: false,
  },
});
