import {Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Profile} from '../interfaces/profile.interface';
import {Pageable} from '../interfaces/pageable.interface';
import {map, Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  baseUrl: string = 'https://icherniakov.ru/yt-course/';
  me = signal<Profile | null>(null);
  filteredProfiles = signal<Profile[]>([]);

  constructor(private http: HttpClient) { }

  getTestsAccounts() {
    return this.http.get<Profile[]>(`${this.baseUrl}account/test_accounts`);
  }

  getMe() {
    return this.http.get<Profile>(`${this.baseUrl}account/me`)
      .pipe(
        tap(value => {
          this.me.set(value);
        })
      );
  }

  getAccount(id: number) {
    return this.http.get<Profile>(`${this.baseUrl}account/${id}`);
  }

  getSubscribersShortList(subsAmount = 3): Observable<Profile[]> {
    return this.http.get<Pageable<Profile>>(`${this.baseUrl}account/subscribers/`)
      .pipe(
        map(res => res.items.slice(0, subsAmount))
      );
  }

  patchProfile(profile: Partial<Profile>) {
    return this.http.patch(`${this.baseUrl}account/me`, profile);
  }

  uploadAvatar(file: File) {
    const fd = new FormData();
    fd.append('image', file);
    return this.http.post<Profile>(`${this.baseUrl}account/upload_image`, fd)
  }

  filterProfiles(params: Record<string, any>) {
    return this.http.get<Pageable<Profile>>(`${this.baseUrl}account/accounts`, {
        params
      }
    ).pipe(
      tap(value => {
        this.filteredProfiles.set(value.items);
      })
    );
  }
}
