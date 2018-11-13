import * as plugins from './csv-fidor.plugins';

import { ExtendedDate } from '@pushrocks/smarttime';

export interface IFidorTransaction {
  Datum: ExtendedDate;
  Beschreibung: string;
  Beschreibung2: string;
  Wert: number;
}

export class CsvFidor {
  /**
   * creates a parsed transaction object from string
   */
  public static async fromString(csvStringArg: string) {
    const csvFidorInstance = new CsvFidor(csvStringArg);
    await csvFidorInstance.parse();
    // console.log(csvFidorInstance);
    return csvFidorInstance;
  }

  /**
   * creates a parsed transaction object from file
   */
  public static fromFile() {}

  /**
   * creates a parsed transaction object from dierctory
   */
  public static async fromDirectory(dirPath: string) {
    const smartfileArray = await plugins.smartfile.fs.fileTreeToObject(dirPath, '**/*.csv');

    const mainCsvFidorInstance = new CsvFidor('');

    for (const smartfile of smartfileArray) {
      const csvFidorInstance = await CsvFidor.fromString(smartfile.contentBuffer.toString());
      await mainCsvFidorInstance.concat([csvFidorInstance]);
    }

    return mainCsvFidorInstance;
  }

  private csvString: string;
  private csvInstance: plugins.smartcsv.Csv;

  public transactions: IFidorTransaction[] = [];

  constructor(csvStringArg: string) {
    this.csvString = csvStringArg;
    this.csvInstance = new plugins.smartcsv.Csv(csvStringArg, {
      headers: true
    });
  }

  /**
   * parse the csv
   */
  async parse() {
    const transactions: any[] = await this.csvInstance.exportAsObject();
    for (const transaction of transactions) {
      transaction.Datum = plugins.smarttime.ExtendedDate.fromEuropeanDate(transaction.Datum);
      transaction.Wert = parseFloat(transaction.Wert.replace('.', '').replace(',', '.'));
    }
    this.transactions = transactions;
  }

  public async concat(csvFidorArrayArg: CsvFidor[]) {
    for (const csvFidor of csvFidorArrayArg) {
      for (const transaction of csvFidor.transactions) {
        this.transactions.push(transaction);
      }
    }
  }
}
