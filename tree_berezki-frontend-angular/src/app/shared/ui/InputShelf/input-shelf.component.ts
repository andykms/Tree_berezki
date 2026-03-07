import { Component, Input } from "@angular/core"
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TextComponent } from "../Text/text.component";
import { InputValueBackground, InputValueSizeMobile, InputType } from "../Input/input.component";


@Component({
  selector: "input-shelf-ui",
  templateUrl: "./input-shelf.component.html",
  styleUrls: ["./input-shelf.component.css"],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TextComponent,
  ]
})
export class InputShelfComponent {
  @Input() size: InputValueSizeMobile = "large_24";
  @Input() background: InputValueBackground = "dark";
  @Input() type: InputType = "text";
  @Input() placeholder: string = "";
  @Input() hasPlaceholderOnInput: boolean = true;
  @Input() errorMessage: string = "";
  @Input() width: string = "auto";
  @Input() isPlaceholderOnInput = false;

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
      "input__border-on-focus": this.isPlaceholderOnInput,
      "error": this.errorMessage.length > 0
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