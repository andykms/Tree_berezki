import { Component, Input} from '@angular/core';

export type TextType = 'main' | 'sub' | 'crossed-out' | "primary" | "danger";

export type TextSizeMobile = 'large_24' | 'large_20' | 'medium_16' | 'medium_14' | "small_12" | "small_10" | "small_8";

export type TextBackground = 'light' | 'dark';

@Component({
  selector: 'text-ui',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class TextComponent {
  @Input() text: string = '';
  @Input() type: TextType = 'main';
  @Input() size: TextSizeMobile = 'medium_16';
  @Input() back: TextBackground = 'dark';
  @Input() bold: boolean = false;

  get textClasses() {
    return {
      'text': true,
      [this.type]: true,
      [this.size]: true,
      [this.back]: true,
      "bold": this.bold
    };
  }
}