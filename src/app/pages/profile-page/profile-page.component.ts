import {Component, inject} from '@angular/core';
import {ProfileHeaderComponent} from '../../common-ui/profile-header/profile-header.component';
import {ProfileService} from '../../data/services/profile.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Observable, switchMap} from 'rxjs';
import {toObservable} from '@angular/core/rxjs-interop';
import {AsyncPipe, NgForOf} from '@angular/common';
import {Profile} from '../../data/interfaces/profile.interface';
import {SvgComponent} from '../../common-ui/svg/svg.component';
import {ImgUrlPipe} from '../../helpers/pipes/img-url.pipe';
import {PostFeedComponent} from '../post-feed/post-feed.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [ProfileHeaderComponent, AsyncPipe, SvgComponent, RouterLink, NgForOf, ImgUrlPipe, PostFeedComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
  activatedRoute = inject(ActivatedRoute)
  profileService = inject(ProfileService);
  me$ = toObservable(this.profileService.me)
  subscribers$ = this.profileService.getSubscribersShortList(5);

  profile$: Observable<Profile | null> = this.activatedRoute.params
    .pipe(
      switchMap(({id}) => {
        if (id === 'me') {
          return this.me$;
        }

        return this.profileService.getAccount(id);
      })
    )


  constructor() {

  }




}
