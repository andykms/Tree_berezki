import { Directive, Output, EventEmitter, OnDestroy, OnInit } from "@angular/core";
import { fromEvent, Subscription, throttleTime, distinctUntilChanged } from "rxjs";

@Directive({
  selector: '[appScrollUp]',
  standalone: true
})
export class ScrollUpDirective implements OnInit, OnDestroy {
  @Output() scrolledUp = new EventEmitter<void>();
  @Output() scrolledDown = new EventEmitter<void>();

  private scrollSubscription!: Subscription;
  private lastScrollTop = 0;
  private readonly THROTTLE_TIME = 100; //миллисекунды

  ngOnInit(): void {
    this.scrollSubscription = fromEvent(window, 'scroll', {passive: true})
      .pipe(
        throttleTime(this.THROTTLE_TIME),
        distinctUntilChanged()
      )
      .subscribe(()=>this.detectScrollDirection());
  }

  ngOnDestroy(): void {
    if(this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }

  private detectScrollDirection() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if(scrollTop > this.lastScrollTop) {
      this.scrolledDown.emit();
    } else if(scrollTop < this.lastScrollTop) {
      this.scrolledUp.emit();
    }

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }
}