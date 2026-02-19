
import type { AccountT } from '@ig/app-engine-models';
import type { SchemaDefinition } from 'mongoose';

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
