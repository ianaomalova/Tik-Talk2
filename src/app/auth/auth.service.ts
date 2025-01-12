import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TokenResponse} from './auth.interface';
import {catchError, tap, throwError} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = 'https://icherniakov.ru/yt-course/auth/';
  token: string | null = null;
  refresh_token: string | null = null;

  cookieService = inject(CookieService);

  constructor(private http: HttpClient, private router: Router) { }

  login(payload: {username: string, password: string}) {
    const fd = new FormData();
    fd.append('username', payload.username);
    fd.append('password', payload.password);
    return this.http.post<TokenResponse>(`${this.baseUrl}token`, fd)
      .pipe(
        tap(value => {
          this.saveTokens(value);
        }),
      );
  }

  get isAuth() {
    if (!this.token) {
      this.token = this.cookieService.get('token');
      this.refresh_token = this.cookieService.get('refresh_token');
    }
    return !!this.token;
  }

  refreshToken() {
    return this.http.post<TokenResponse>(`${this.baseUrl}refresh`, {
      refresh_token: this.refresh_token,
    }).pipe(
      tap(value => {
        this.saveTokens(value);
      }),
      catchError(error => {
        this.logout();
        return throwError(error);
      })
    )
  }

  logout() {
    this.cookieService.deleteAll();
    this.token = null;
    this.refresh_token = null;
    this.router.navigate(['/login']);
  }

  saveTokens(value: TokenResponse) {
    this.token = value.access_token;
    this.refresh_token = value.refresh_token;

    this.cookieService.set('token', this.token);
    this.cookieService.set('refresh_token', this.refresh_token);
  }
}
