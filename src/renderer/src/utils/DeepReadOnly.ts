export type DeepReadOnly<T> = {
  readonly [K in keyof T]: DeepReadOnly<T[K]>
}
