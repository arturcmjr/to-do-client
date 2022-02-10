import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getFirebaseError } from '@shared/helpers/others/get-firebase-error';
import {
  Auth,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  verifyPasswordResetCode,
} from 'firebase/auth';
import { Observable } from 'rxjs';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth;
  private uidStorageKey = 'firebase_user_uid';

  constructor(private firebase: FirebaseService, private route: Router) {
    this.auth = getAuth();
    this.auth.languageCode = 'en';

    this.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        localStorage.setItem(this.uidStorageKey, authUser.uid);
      } else {
        localStorage.removeItem(this.uidStorageKey);
      }
    });
  }

  public getUserUid(): string | null {
    return localStorage.getItem(this.uidStorageKey);
  }

  public login(email: string, password: string): Observable<void> {
    return new Observable<void>((observable) => {
      signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          observable.next();
          observable.complete();
        })
        .catch((error) => {
          const errorCode = error.code;
          observable.error(getFirebaseError(errorCode));
        });
    });
  }

  public logout(): Observable<void> {
    return new Observable<void>((observable) => {
      signOut(this.auth)
        .then(() => {
          observable.next();
          observable.complete();
          this.route.navigate(['/login']);
        })
        .catch((error) => {
          observable.error(error);
        });
    });
  }

  public register(email: string, password: string): Observable<void> {
    return new Observable<void>((observable) => {
      createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          observable.next();
          observable.complete();
        })
        .catch((error) => {
          const errorCode = error.code;
          observable.error(getFirebaseError(errorCode));
        });
    });
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem(this.uidStorageKey);
  }

  public getFirebaseAuth(): Auth {
    return this.auth;
  }

  public sendRecoverEmail(email: string): Observable<void> {
    return new Observable<void>((observable) => {
      sendPasswordResetEmail(this.auth, email)
        .then(() => {
          observable.next();
          observable.complete();
        })
        .catch((error) => {
          const errorCode = error.code;
          observable.error(getFirebaseError(errorCode));
        });
    });
  }

  public verifyPasswordResetCode(code: string): Observable<string> {
    return new Observable((observable) => {
      verifyPasswordResetCode(this.auth, code)
        .then((email) => {
          observable.next(email);
          observable.complete();
        })
        .catch((error) => {
          const errorCode = error.code;
          observable.error(getFirebaseError(errorCode));
        });
    });
  }

  public confirmPasswordReset(
    newPassword: string,
    oobCode: string
  ): Observable<void> {
    return new Observable((observable) => {
      confirmPasswordReset(this.auth, oobCode, newPassword)
        .then(() => {
          observable.next();
          observable.complete();
        })
        .catch((error) => {
          const errorCode = error.code;
          observable.error(getFirebaseError(errorCode));
        });
    });
  }
}
