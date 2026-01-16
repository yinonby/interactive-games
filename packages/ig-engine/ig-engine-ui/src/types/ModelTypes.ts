
export type ModelWithoutDataT = {
  isLoading: true | false;
  isError: true | false;
  data?: never;
} & (
  | { isLoading: true; isError: boolean }
  | { isLoading: boolean; isError: true }
);

export type ModelWithDataT<T> = {
  isLoading: false;
  isError: false;
  data: T;
};
