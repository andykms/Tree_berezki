import { Component, Input, Output, EventEmitter } from "@angular/core"
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputFocusDirective } from "../../directives/input-focus.directive";

export type InputValueSizeMobile = 'large_24' | 'large_20' | 'medium_16' | 'medium_14' | "small_12" | "small_10" | "small_8";

export type InputValueBackground = 'light' | 'dark';

@Component({
  selector: "input-ui",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.css"],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputFocusDirective
  ]
})
export class InputComponent {
  @Input() size: InputValueSizeMobile = "large_24";
  @Input() background: InputValueBackground = "dark";
  @Input() required: boolean = false;
  @Input() minLength: number = 0;
  @Input() maxLength: number = 255;
  @Input() pattern: string = "";
  @Input() formControlName: string = "";
  @Input() placeholder: string = "";
  @Output() onFocus = new EventEmitter<void>();
  @Output() onEmpty = new EventEmitter<void>();
  @Output() onBlur = new EventEmitter<void>();

  onFocusEvent() {
    this.onFocus.emit();
  }

  onEmptyEvent() {
    this.onEmpty.emit();
  }

  onBlurEvent() {
    this.onBlur.emit();
  }

  get inputClasses() {
    return {
      "input": true,
      [this.size]: true,
      [this.background]: true
    }
  }
}