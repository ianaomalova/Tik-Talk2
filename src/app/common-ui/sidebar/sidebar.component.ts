import {Component, inject, OnInit} from '@angular/core';
import {SvgComponent} from '../svg/svg.component';
import {AsyncPipe, JsonPipe, NgForOf} from '@angular/common';
import {SubscriberCardComponent} from './subscriber-card/subscriber-card.component';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {ProfileService} from '../../data/services/profile.service';
import {ImgUrlPipe} from '../../helpers/pipes/img-url.pipe';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SvgComponent,
    NgForOf,
    SubscriberCardComponent,
    RouterLink,
    AsyncPipe,
    JsonPipe,
    ImgUrlPipe,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  profileService = inject(ProfileService);

  subscribers$ = this.profileService.getSubscribersShortList();
  me = this.profileService.me;

  menuItems =[
    {
      label: 'Моя страница',
      icon: 'home',
      link: '/profile/me'
    },
    {
      label: 'Чаты',
      icon: 'chat',
      link: '/chats'
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: '/search',
    },
  ]

  ngOnInit() {
    this.profileService.getMe().subscribe()
  }
}
