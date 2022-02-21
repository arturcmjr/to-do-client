import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  const authMock = jasmine.createSpyObj('AuthenticationService', ['isLoggedIn','logout']);
  const routerMock = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    });
    guard = new AuthGuard(authMock,routerMock);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should not be able to activate page if not logged in', () => {
    authMock.isLoggedIn.and.returnValue(false);
    const result = guard.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{url: 'tasks'});
    expect(result).toBeFalse();
  });

  it('should not able to activate page if logged in', () => {
    authMock.isLoggedIn.and.returnValue(true);
    const result = guard.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{url: 'tasks'});
    expect(result).toBeTrue();
  });

  it('should navigate to login page if not logged in', () => {
    authMock.isLoggedIn.and.returnValue(false);
    guard.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{url: 'tasks'});
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
