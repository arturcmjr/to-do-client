import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { observable, Observable, throwError } from 'rxjs';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth();
  private uidStorageKey = 'firebase_user_uid';

  constructor(private firebase: FirebaseService, private route: Router) {
    this.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        localStorage.setItem(this.uidStorageKey, authUser.uid);
      } else {
        localStorage.removeItem(this.uidStorageKey);
      }
    });
  }

  public getUserUid() : string | null {
    return localStorage.getItem(this.uidStorageKey);
  }

  public login(email: string, password: string): Observable<void> {
    return new Observable<void>((observable) => {
      signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          observable.next();
          observable.complete();
          console.log(user);
          // TODO: store data
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          observable.error({ errorMessage, errorCode });
        });
    });
  }

  public logout() : Observable<void> {
    return new Observable<void>((observable) => {
      signOut(this.auth).then(() => {
        observable.next();
        observable.complete();
        this.route.navigate(['/login']);
      }).catch((error) => {
        observable.error(error);
      });
    });
  }

  public register(email: string, password: string): void {
    // TODO: transform in observable
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  public isLoggedIn() : boolean {
    return !!localStorage.getItem(this.uidStorageKey);
  }

  public getFirebaseAuth(): Auth {
    return this.auth;
  }
}