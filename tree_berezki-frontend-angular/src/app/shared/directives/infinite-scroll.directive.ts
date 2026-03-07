import {
  Directive,
  Output,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  NgZone,
  ElementRef,
  Optional,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime, filter } from 'rxjs';

export interface InfiniteScrollConfig {
  threshold?: number;
  throttleTime?: number;
  root?: Element | null;
  rootMargin?: string;
}

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true,
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {
  @Input() infiniteScrollDisabled = false;
  @Input() infiniteScrollConfig: InfiniteScrollConfig = {};

  @Output() infiniteScroll = new EventEmitter<void>();

  private scrollSubscription?: Subscription;
  private observer?: IntersectionObserver;

  private defaultConfig: InfiniteScrollConfig = {
    threshold: 100,
    throttleTime: 100,
    root: null,
    rootMargin: '0px',
  };

  constructor(
    private elementRef: ElementRef,
    private ngZone: NgZone,
    @Optional() @Inject(PLATFORM_ID) private platformId?: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId ? this.platformId : new Object())) {
      return;
    }

    const config = { ...this.defaultConfig, ...this.infiniteScrollConfig };

    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver(config);
    } else {
      this.setupScrollListener(config);
    }
  }

  private setupIntersectionObserver(config: InfiniteScrollConfig): void {
    const trigger = document.createElement('div');
    trigger.style.cssText = `
    height: 1px;
    width: 1px;
    visibility: hidden;
    `;
    this.elementRef.nativeElement.appendChild(trigger);

    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !this.infiniteScrollDisabled) {
              this.ngZone.run(() => {
                this.infiniteScroll.emit();
              });
            }
          });
        },
        {
          root: config.root,
          rootMargin: config.rootMargin,
          threshold: 0.1
        }
      );

      this.observer.observe(trigger);
    });
  }

  private setupScrollListener(config: InfiniteScrollConfig): void {
    this.ngZone.runOutsideAngular(() => {
      this.scrollSubscription = fromEvent(window, 'scroll')
        .pipe(
          throttleTime(config.throttleTime!),
          filter(() => !this.infiniteScrollDisabled)
        )
        .subscribe(() => {
          if (this.isNearBottom(config.threshold!)) {
            this.ngZone.run(() => {
              this.infiniteScroll.emit();
            });
          }
        });
    });
  }

  private isNearBottom(threshold: number): boolean {
    const element = this.elementRef.nativeElement;
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const elementBottom = element.offsetTop + element.offsetHeight;

    return elementBottom - (scrollPosition + windowHeight) < threshold;
  }

  checkPosition(): void {
    if(!this.infiniteScrollDisabled) {
      const config = {...this.defaultConfig, ...this.infiniteScrollConfig};
      if(this.isNearBottom(config.threshold!)) {
        this.infiniteScroll.emit();
      }
    }
  }

  ngOnDestroy(): void {
    if(this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
    if(this.observer) {
      this.observer.disconnect();
    }
  }
}

