import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';
import {BehaviorSubject, catchError, filter, switchMap, tap, throwError} from 'rxjs';

let isRefreshing$ = new BehaviorSubject<boolean>(false);

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token;
  if (!token) {
    return next(req);
  }

  if (isRefreshing$.value) {
    return refreshToken(authService, req, next);
  }

  return next(addToken(req, token))
    .pipe(
      catchError(error => {
        if (error.status === 403) {
          return refreshToken(authService, req, next);
        }

        return throwError(error);
      })
    )
}

const refreshToken =
  (authService: AuthService, req: HttpRequest<any>, next: HttpHandlerFn) => {
    if (!isRefreshing$.value) {
      isRefreshing$.next(true);
      return authService.refreshToken()
        .pipe(
          switchMap((res) => {
            return next(addToken(req, res.access_token)).pipe(
              tap(() => {
                isRefreshing$.next(false);
              })
            );
          })
        )
    }

    if(req.url.includes('refresh')) return next(addToken(req, authService.token!));

    return isRefreshing$.pipe(
      filter(isRefreshing => !isRefreshing),
      switchMap(response => {
        return next(addToken(req, authService.token!));
      })
    )
  }

const addToken = (req: HttpRequest<any>, token: string) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })
}
