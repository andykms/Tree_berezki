import { Directive, HostListener, EventEmitter } from "@angular/core";
import { Output } from "@angular/core";

@Directive({
  selector: "[mouseEnter]",
  standalone: true
})
export class MouseEnterDirective {

  @Output() mouseEnter = new EventEmitter<void>();
  @Output() mouseLeave = new EventEmitter<void>();

  @HostListener("mouseenter") onMouseEnter() {
    this.mouseEnter.emit();
  }

  @HostListener("mouseleave") onMouseLeave() {
    this.mouseLeave.emit();
  }
}