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
  static fromString() {}

  /**
   * creates a parsed transaction object from file
   */
  static fromFile() {}

  /**
   * creates a parsed transaction object from dierctory
   */
  static fromDirectory(dirPath) {

  }

  constructor(csvStringArg: string) {
    const csvInstance = new plugins.smartcsv.Csv(csvStringArg, {
      headers: true
    });

    
  }
}