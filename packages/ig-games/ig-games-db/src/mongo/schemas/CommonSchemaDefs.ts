
import type { DurationInfoT, ImageInfoT, PriceInfoT } from '@ig/games-models'
import type { SchemaDefinition } from 'mongoose'

export const imageInfoSchemaDef: SchemaDefinition<ImageInfoT> = {
  kind: {
    type: String,
    required: true,
    enum: ['asset', 'url'],
  },

  imageAssetName: {
    type: String,
    required: function (): boolean {
      return this.kind === 'asset'
    },
  },

  imageUrl: {
    type: String,
    required: function (): boolean {
      return this.kind === 'url'
    },
  },
}

export const durationInfoSchemaDef: SchemaDefinition<DurationInfoT> = {
  kind: {
    type: String,
    required: true,
    enum: ['limited', 'unlimited'],
  },

  durationMs: {
    type: Number,
    required: function (): boolean {
      return this.kind === 'limited'
    },
    min: 0,
  },
}

export const priceInfoSchemaDef: SchemaDefinition<PriceInfoT> = {
  kind: {
    type: String,
    required: true,
    enum: ['notFree', 'free'],
  },

  priceRate: {
    type: Number,
    required: function (): boolean {
      return this.kind === 'notFree'
    },
    min: 0,
  },

  priceCurrency: {
    type: String,
    required: function () {
      return this.kind === 'notFree'
    },
  },
}
