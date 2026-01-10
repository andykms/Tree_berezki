import {Component, Input } from '@angular/core';
import { InputComponent, InputValueBackground, InputValueSizeMobile } from '../Input/input.component';
import { CodeInputsDirective } from '../../directives/code-inputs.directive';
import { TextComponent, TextBackground } from '../Text/text.component';

@Component({
  imports: [
    InputComponent,
    CodeInputsDirective,
    TextComponent
  ],
  selector: "input-code-ui",
  templateUrl: "./input-code.component.html",
  styleUrls: ["./input-code.component.css"]
})
export class InputCodeComponent {
  @Input() size: InputValueSizeMobile = "large_24";
  @Input() background: InputValueBackground = "dark";
  @Input() errorMessage: string = "";
  @Input() back: TextBackground = "dark";
  @Input() formControlNames: string[] = [];

  hasInputs: boolean[] = [];

  constructor() {
    this.hasInputs = new Array(this.formControlNames.length).fill(false);
  }

  onHasInputEvent(index: number) {
    this.hasInputs[index] = true;
  }

  onWithoutInputEvent(index: number) {
    this.hasInputs[index] = false;
  }

  borderClasses(index: number) {
    return {
      "input-code__border": true,
      "input-code__border-has": this.hasInputs[index],
      "input-code__border-error": this.errorMessage.length > 0,
    }
  }

  placeholderClasses(index: number) {
    return {
      "input-code__placeholder": true,
      "input-code__placeholder-off": this.hasInputs[index],
    }
  }
}
