import {AfterViewInit, Component, effect, inject, OnInit, ViewChild} from '@angular/core';
import {ProfileHeaderComponent} from '../../common-ui/profile-header/profile-header.component';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProfileService} from '../../data/services/profile.service';
import {firstValueFrom} from 'rxjs';
import {AvatarUploadComponent} from './avatar-uploade/avatar-upload.component';

@Component({
  selector: 'app-setting-page',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    ReactiveFormsModule,
    AvatarUploadComponent
  ],
  templateUrl: './setting-page.component.html',
  styleUrl: './setting-page.component.scss'
})
export class SettingPageComponent implements AfterViewInit {
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);
  @ViewChild(AvatarUploadComponent) avatarUploader: AvatarUploadComponent | undefined;

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{value: '', disabled: true}, Validators.required],
    description: [''],
    stack: ['']
  })

  ngAfterViewInit() {

  }

  constructor() {
    effect(() => {
      // @ts-ignore
      this.form.patchValue({
        ...this.profileService.me(),
        // @ts-ignore
        stack: this.mergeStack(this.profileService.me()?.stack)
      });
    })
  }

  saveProfileSettings() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      return;
    } else {
      // @ts-ignore
      firstValueFrom(this.profileService.patchProfile({
      ...this.profileService.me(),
        // @ts-ignore
        stack: this.splitStack(this.form.value.stack)
      }));
    }

    if (this.avatarUploader?.avatar) {
      firstValueFrom(this.profileService.uploadAvatar(this.avatarUploader.avatar));
    }
  }

  splitStack(stack: string | null | string[]): string[] {
    console.log(stack);
    if (!stack) {
      return [];
    }
    if (Array.isArray(stack)) {
      return stack;
    } else {
      return stack.split(',');
    }
  }

  mergeStack(stack: string | null | string[]) {
    if (!stack) {
      return '';
    }
    if (Array.isArray(stack)) {
      return stack.join(',');
    } else {
      return stack.split(',');
    }
  }
}
