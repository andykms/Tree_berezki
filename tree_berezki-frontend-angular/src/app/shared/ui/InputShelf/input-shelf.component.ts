import { Component, Input } from "@angular/core"
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TextComponent } from "../Text/text.component";
import { InputComponent, InputValueBackground, InputValueSizeMobile } from "../Input/input.component";

@Component({
  selector: "input-shelf-ui",
  templateUrl: "./input-shelf.component.html",
  styleUrls: ["./input-shelf.component.css"],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TextComponent,
    InputComponent
  ]
})
export class InputShelfComponent {
  @Input() size: InputValueSizeMobile = "large_24";
  @Input() background: InputValueBackground = "dark";
  @Input() required: boolean = false;
  @Input() minLength: number = 0;
  @Input() maxLength: number = 255;
  @Input() pattern: string = "";
  @Input() placeholder: string = "";
  @Input() hasPlaceholderOnInput: boolean = false;
  @Input() errorMessage: string = "";
  @Input() formControlName: string = "";
  @Input() width: string = "auto";

  isPlaceholderOnInput = false;

  onFocusEvent() {
    this.isPlaceholderOnInput = true;
  }

  onEmptyEvent() {
    this.isPlaceholderOnInput = false;
  }

  get placeholderClasses() {
    return {
      "input__placeholder": true,
      "input__placeholder-on-input": this.isPlaceholderOnInput && this.hasPlaceholderOnInput
    }
  }
  
  get placeholderVisible() {
    return !this.isPlaceholderOnInput || this.hasPlaceholderOnInput ? "visible" : "none";
  }

  get placeholderType() {
    return this.isPlaceholderOnInput && this.hasPlaceholderOnInput ? "main" : "sub";
  }

  get placeholderSize() {
    return this.isPlaceholderOnInput && this.hasPlaceholderOnInput ? "small_10" : "large_20";
  }

  get borderClasses() {
    return {
      "input__border": true,
      "input__border-on-focus": this.isPlaceholderOnInput
    }
  }

  get inputClasses() {
    return {
      "input": true,
      [this.size]: true,
      [this.background]: true
    }
  }
}