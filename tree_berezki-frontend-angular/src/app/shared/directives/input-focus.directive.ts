import { Directive, HostListener, EventEmitter, ElementRef } from "@angular/core";
import { Output } from "@angular/core";

@Directive({
  selector: "[inputFocus]",
  standalone: true
})
export class InputFocusDirective {
  @Output() onFocus = new EventEmitter<void>();
  @Output() onEmpty = new EventEmitter<void>();
  @Output() onBlur = new EventEmitter<void>();

  focused: boolean = false;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  get value() {
    return this.el.nativeElement.value;
  }

  @HostListener("focus") onFocusEvent() {
    this.focused = true;
    this.onFocus.emit();
  }

  @HostListener("blur") onBlurEvent() {
    this.focused = false;
    if(this.value === "") {
      this.onEmpty.emit();
    }
    this.onBlur.emit();
  }

  @HostListener("change") onChangeEvent() {
    if (this.value === "" && !this.focused) {
      this.onEmpty.emit();
    }
  }
}