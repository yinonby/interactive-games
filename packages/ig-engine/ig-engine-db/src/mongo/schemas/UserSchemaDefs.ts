
import type { UserT } from '@ig/engine-models';
import type { SchemaDefinition } from 'mongoose';

export const userSchemaDef: SchemaDefinition<UserT> = {
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: false,
  },
  nickname: {
    type: String,
    required: false,
  },
}
