import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Observable, throwError } from 'rxjs';
import { FirebaseService } from '../services/firebase/firebase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth();

  constructor(private firebase: FirebaseService) {
    // console.log(this.auth.log);
  }

  public login(email: string, password: string) : Observable<boolean> {
    return new Observable<boolean>((observable) => {
      signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        observable.next(true);
        observable.complete();
        console.log(user);
        // TODO: store data
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        observable.error({errorMessage, errorCode});
      });
    });
    
  }

  public register(email: string, password: string) : void {
    createUserWithEmailAndPassword(this.auth,email,password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
  }

  public getFirebaseAuth() : Auth {
    return this.auth;
  }
}
