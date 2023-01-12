export type DOMMessage = {
  type: DOMMessageType;
};

export type DOMMessageResponse<T = unknown> = {
  errorMessage: string;
  data: T;
  type: string;
};

export enum DOMMessageType {
  GET_TABLE_DATA = 'GET_TABLE_DATA',
}

export enum DOMMessageResponseType {
  GET_TABLE_DATA_RESPONSE = 'GET_TABLE_DATA_RESPONSE',
  ERROR = 'ERROR',
}

export type GetTableDataResponseData = TableRow[];

export type TableRow = {
  name: string;
  value: string;
};
