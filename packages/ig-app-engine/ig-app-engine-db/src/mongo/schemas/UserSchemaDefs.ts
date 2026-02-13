
import type { SchemaDefinition } from 'mongoose';
import type { AccountT, UserT } from '../../../../ig-app-engine-models';

export const getUserSchemaDef = (): SchemaDefinition<UserT> => ({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: false,
  },
})

export const getAccountSchemaDef = (): SchemaDefinition<AccountT> => ({
  accountId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: false,
  },
})
