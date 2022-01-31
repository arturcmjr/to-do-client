export interface ITask {
  id: string;
  order: number;
  text: string;
  date?: Date;
}

export interface IDbTask {
  order: number;
  text: string;
  date: number | null;
}