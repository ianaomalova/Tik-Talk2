import {Component, signal} from '@angular/core';
import {SvgComponent} from '../../../common-ui/svg/svg.component';
import {DndDirective} from '../../../helpers/directives/dnd.directive';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [
    SvgComponent,
    DndDirective,
    FormsModule
  ],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss'
})
export class AvatarUploadComponent {
  preview = signal<string>('/assets/images/avatar.png');
  avatar: File | null = null;

  fileInput($event: Event) {
    const file = ($event.target as HTMLInputElement).files?.[0];
    this.processFile(file);
  }

  onFileDropped(file: File) {
    this.processFile(file);
  }

  processFile(file: File | undefined) {
    if (!file || !file.type.match('image')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      // @ts-ignore
      this.preview.set(e.target.result.toString() ?? '');
    }
    reader.readAsDataURL(file);
    this.avatar = file;
  }
}
