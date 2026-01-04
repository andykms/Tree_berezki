import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'position-dots-ui',
  templateUrl: './position-dots.component.html',
  styleUrls: ['./position-dots.component.css']
})
export class PositionDotsComponent implements OnChanges {
  @Input() count: number = 0;
  @Input() active: number = 0;
  @Output() activeChange = new EventEmitter<number>();
  
  visibleDots: number[] = [];
  maxVisible = 5;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['count'] || changes['active']) {
      this.updateVisibleDots();
    }
  }
  
  private updateVisibleDots(): void {
    if (this.count <= this.maxVisible) {
      // Если точек меньше или равно 5, показываем все
      this.visibleDots = Array.from({ length: this.count }, (_, i) => i);
    } else {
      // Рассчитываем видимый диапазон из 5 точек
      let start = Math.max(0, Math.min(
        this.active - Math.floor(this.maxVisible / 2),
        this.count - this.maxVisible
      ));
      
      this.visibleDots = Array.from(
        { length: this.maxVisible }, 
        (_, i) => start + i
      );
    }
  }
  
  selectDot(index: number): void {
    if (index >= 0 && index < this.count) {
      this.activeChange.emit(index);
    }
  }
  
  isDotVisible(index: number): boolean {
    return this.visibleDots.includes(index);
  }
}