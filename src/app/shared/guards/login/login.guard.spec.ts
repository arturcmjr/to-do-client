import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginGuard } from './login.guard';

describe('LoginGuard', () => {
  let guard: LoginGuard;
  const authMock = jasmine.createSpyObj('AuthenticationService', ['isLoggedIn']);
  const routerMock = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });
    guard = new LoginGuard(authMock,routerMock);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should not be able to activate page if logged in', () => {
    authMock.isLoggedIn.and.returnValue(true);
    const result = guard.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{url: 'login'});
    expect(result).toBeFalse();
  });

  it('should be able to activate page if not logged in', () => {
    authMock.isLoggedIn.and.returnValue(false);
    const result = guard.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{url: 'login'});
    expect(result).toBeTrue();
  });

  it('should navigate to home page if logged in', () => {
    authMock.isLoggedIn.and.returnValue(true);
    guard.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{url: 'login'});
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});
