import * as plugins from '../csv-fidor.plugins';

export interface IFidorOriginalTransaction {
  Datum: string;
  Beschreibung: string;
  Beschreibung2: string;
  Wert: string;
}

export interface IFidorTransaction {
  original: IFidorOriginalTransaction;
  simpleTransaction: plugins.tsclass.ITransaction;
  transactionHash: string;
  transactionDate: plugins.smarttime.ExtendedDate;
  description: string;
  description2: string;
  amount: number;
}
