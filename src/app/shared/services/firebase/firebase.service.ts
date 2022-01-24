import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  
  constructor() {
    const app = initializeApp(environment.firebaseConfig);
    const analytics = getAnalytics(app);
  }
}
