import { Component, Input, Output, EventEmitter } from '@angular/core';

export type TStarsType = 'base' | 'selectable';
export type TStarsForm = 'yellow' | 'white';
export type TStarsSize = 'large' | 'small';

@Component({
  selector: 'stars-ui',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.css'],
})
export class StarsComponent {
  @Input() type: TStarsType = 'base';
  @Input() form: TStarsForm = 'white';
  @Input() size: TStarsSize = 'small';
  @Input() selected: number = 1;
  @Input() count: number = 5;
  @Output() onStarClick = new EventEmitter<number>();

  starIndexes = new Array(this.count).fill(0).map((_, i) => i + 1);

  constructor() {
    if (this.selected > this.count) {
      this.selected = this.count;
    }
  }


  get starsClasses() {
    return {
      "stars__container": true,
      [this.size]: true,
    }
  }

  onClick(index: number) {
    if (this.type === 'selectable') {
      this.onStarClick.emit(index);
    }
  }

  isFilled(index: number) {
    return index < this.selected;
  }

  get starSize() {
    return this.size === 'large' ? '60px' : '15px';
  }

  starFill(index: number) {
    return this.isFilled(index) ? (this.form === 'yellow' ? 'var(--star)' : 'var(--text)') : 'transparent';
  }

  get starBorderFill() {
    return this.form === 'yellow' ? 'var(--star)' : 'var(--text)';
  }
}
