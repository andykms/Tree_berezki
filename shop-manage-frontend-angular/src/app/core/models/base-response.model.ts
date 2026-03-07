export interface IBaseResponse<T> {
  items: T[],
  total: number
}