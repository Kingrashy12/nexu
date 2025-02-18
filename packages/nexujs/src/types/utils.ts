export type DataGroup<T> = {
  data: T[];
  key: keyof T;
};
