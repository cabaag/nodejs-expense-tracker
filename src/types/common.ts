export enum Command {
  ADD = 'add',
  DELETE = 'delete',
  UPDATE = 'update',
  LIST = 'list',
  SUMMARY = 'summary',
}

export type Transaction = {
  id: number;
  description: string;
  amount: number;
  createdAt: Date;
}