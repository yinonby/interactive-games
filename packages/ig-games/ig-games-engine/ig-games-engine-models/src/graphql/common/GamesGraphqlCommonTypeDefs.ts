
import { gql } from 'graphql-tag';

export const gamesGraphqlDirectiveTypeDefs = gql`
  directive @auth(requires: Role) on OBJECT | FIELD_DEFINITION

  enum Role {
    gamesSystemAdmin
  }
`;

export const gamesGraphqlCommonTypeDefs = gql`
  enum Currency {
    USD
    EUR
  }

  type DurationInfo {
    kind: String! # "limited" or "unlimited"
    durationMs: Int
  }

  input DurationInfoInput {
    kind: String! # "limited" or "unlimited"
    durationMs: Int
  }

  type PriceInfo {
    kind: String! # "free" or "notFree"
    priceRate: Float
    priceCurrency: Currency
  }

  input PriceInfoInput {
    kind: String! # "free" or "notFree"
    priceRate: Float
    priceCurrency: Currency
  }

  type ImageInfo {
    kind: String! # "asset" or "url"
    imageAssetName: String
    imageUrl: String
  }

  input ImageInfoInput {
    kind: String! # "asset" or "url"
    imageAssetName: String
    imageUrl: String
  }

  enum UpdateStatus {
    ok
  }
`;
