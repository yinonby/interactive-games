
import type { SchemaDefinition } from 'mongoose';
import type { UserT } from '../../../../ig-app-engine-models';

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
