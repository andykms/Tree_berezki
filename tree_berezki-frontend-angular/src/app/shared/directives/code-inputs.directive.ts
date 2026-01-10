import {
  Directive,
  Output,
  ElementRef,
  HostListener,
  OnDestroy,
  AfterViewInit,
  EventEmitter,
} from '@angular/core';
import { fromEvent, Subscription, throttleTime, distinctUntilChanged } from 'rxjs';

@Directive({
  selector: '[codeInputs]',
  standalone: true,
})
export class CodeInputsDirective implements OnDestroy, AfterViewInit {
  @Output() onHasInput = new EventEmitter<number>();
  @Output() onWithoutInput = new EventEmitter<number>();

  element: ElementRef;
  inputs: HTMLInputElement[] = [];
  hasInputs: boolean[] = [];
  activeInputIndex: number = 0;
  private readonly THROTTLE_TIME = 100;
  private focusSubscriptions: Subscription[] = [];
  private keydownSubscription!: Subscription;

  constructor(elementRef: ElementRef) {
    this.element = elementRef;
    this.hasInputs = new Array(this.inputs.length).fill(false);
  }

  ngAfterViewInit() {
    this.inputs = this.element.nativeElement.querySelectorAll('input');
    this.inputs.forEach((input, index) => {
      this.focusSubscriptions.push(
        fromEvent(input, 'focus', { passive: true })
          .pipe(throttleTime(this.THROTTLE_TIME), distinctUntilChanged())
          .subscribe(() => {
            this.onFocus(index);
          })
      );
    });
    this.keydownSubscription = fromEvent(document, 'keydown', { passive: true })
      .pipe(throttleTime(this.THROTTLE_TIME), distinctUntilChanged())
      .subscribe((event: Event) => {
        this.onKeydown(event);
      });
  }

  ngOnDestroy() {
    this.focusSubscriptions.forEach((subscription) => subscription.unsubscribe());
    this.keydownSubscription.unsubscribe();
  }

  onFocus(index: number) {
    if (index - this.activeInputIndex == 1 && index < this.inputs.length) {
      return;
    }
    this.inputs[this.activeInputIndex].focus();
  }

  onKeydown(event: Event) {
    if (event instanceof KeyboardEvent && event.key === 'Backspace' && this.inputs[this.activeInputIndex + 1]?.value.length === 0) {
      this.inputs[this.activeInputIndex].focus();
    }
  }

  @HostListener('input') onInput() {
    if (this.inputs[this.inputs.length - 1].value.length >= 1) {
      this.inputs[this.inputs.length - 1].blur();
    }

    this.inputs.forEach((input, index) => {
      if (input.value.length >= 1) {
        if (!this.hasInputs[index]) {
          this.onHasInput.emit(index);
          this.hasInputs[index] = true;
        }
        this.activeInputIndex = index;
        if (this.hasInputs[index])
          if (index < this.inputs.length - 1) {
            this.inputs[index + 1].focus();
          }
      } else if (this.hasInputs[index]) {
        this.onWithoutInput.emit(index);
        this.hasInputs[index] = false;
      }
    });
  }
}
