import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from '@env';
import { Database, getDatabase } from 'firebase/database';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private database: Database;
  
  constructor() {
    const app = initializeApp(environment.firebaseConfig);
    this.database = getDatabase(app);
  }

  public getDataBase() : Database {
    return this.database;
  }
}
