import {Directive, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[dnd]'
})
export class DndDirective {
  @Output() fileDropped = new EventEmitter<File>();
  @HostBinding('class.fileover')
  fileover = false;

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.fileover = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.fileover = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.fileover = false;

    this.fileDropped.emit(event.dataTransfer?.files[0]);
  }
  constructor() { }

}
