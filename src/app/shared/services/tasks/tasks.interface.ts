export interface ITask {
  id: string;
  order: number;
  text: string;
  date?: number;
}

export interface IDbTask {
  order: number;
  text: string;
  date?: number;
}