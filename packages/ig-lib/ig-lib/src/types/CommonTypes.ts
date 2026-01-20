
export type GeoLocationCoordsT = {
  latitude: number,
  longitude: number,
}

export type XOR<T, U> =
  | (T & { [K in keyof U]?: never })
  | (U & { [K in keyof T]?: never });
