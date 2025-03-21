import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../services/aurh.service';
import { firstValueFrom } from 'rxjs';

export const NotAuthenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  const authServices = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = await firstValueFrom(authServices.checkStatus());

  if (isAuthenticated) {
    router.navigateByUrl('/');
    return false;
  }
  return true;
};
