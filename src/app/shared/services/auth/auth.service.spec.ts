import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

export class MockAuthService extends AuthService {
  public override login(email: string, password: string): Observable<void> {
    return new Observable<void>((observable) => {
      if (password === 'letmein') {
        observable.next();
        observable.complete();
      } else {
        observable.error('wrong-password');
      }
    });
  }

  public override sendRecoverEmail(email: string): Observable<void> {
    return new Observable<void>((observable) => {
      if (email === 'cool@dude.com') {
        observable.next();
        observable.complete();
      } else {
        observable.error('user-not-found');
      }
    });
  }

  public override confirmPasswordReset(
    newPassword: string,
    oobCode: string
  ): Observable<void> {
    return new Observable((observable) => {
      if (oobCode === 'valid_code') {
        observable.next();
        observable.complete();
      } else {
        observable.error('invalid-action-code');
      }
    });
  }

  public override register(email: string, password: string): Observable<void> {
    return new Observable<void>((observable) => {
      if (email !== 'cool@dude.com') {
        observable.next();
        observable.complete();
      } else {
        observable.error('email-already-in-use');
      }
    });
  }
}

describe('AuthService', () => {
  let service: AuthService;
  let storageKey: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });
    service = TestBed.inject(AuthService);
    storageKey = service["uidStorageKey"];
    localStorage.removeItem(storageKey);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be logged in if has no user id stored', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should be logged in if has user id stored', () => {
    localStorage.setItem(storageKey,'some_uid');
    expect(service.isLoggedIn()).toBeTrue();
  });
});
