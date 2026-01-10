import {Component, Input} from '@angular/core';

import { TextComponent, TextType, TextSizeMobile, TextBackground } from '../Text/text.component';
import { ButtonComponent } from '../Button/button.component';

@Component({
  selector: 'text-dropdown-ui',
  templateUrl: './text-dropdown.component.html',
  styleUrls: ['./text-dropdown.component.css'],
  imports: [TextComponent, ButtonComponent]
})
export class TextDropdownComponent {
  @Input() text: string = "";
  @Input() hiddenLength: number = 64;
  @Input() textButton: string = "ещё";
  @Input() height: string = "100%";

  @Input() type: TextType = 'main';
  @Input() size: TextSizeMobile = 'medium_14';
  @Input() back: TextBackground = 'dark';
  @Input() bold: boolean = false;

  isHidden = true;

  toggle() {
    this.isHidden = ! this.isHidden;
  }

  get textToShow() {
    return this.isHidden ? this.text.slice(0, this.hiddenLength) + "...": this.text;
  }

  get textButtonShow() {
    return this.isHidden ? this.textButton : "скрыть";
  }

  get textButtonType() {
    return this.isHidden ? "primary" : "sub";
  }

  get textDropdownClasses() {
    return {
      'text-dropdown__container': true,
      'text-dropdown_hidden': this.isHidden
    }
  }

  get textDropdownHeight() {
    return this.isHidden ? this.height : 'auto';
  }

  get isTextMore() {
    return this.text.length > this.hiddenLength;
  }
}
