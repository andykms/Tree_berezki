import { Component, Input, OnInit, OnDestroy, signal, ElementRef} from "@angular/core";
import { timer, Subscription } from "rxjs";

import { TAdvertInfo } from "../AdvertInfo/advert-info.component";
import { AdvertBannerComponent } from "../AdvertBanner/advert-banner.component";


export type TAdvertCarouselInfo = TAdvertInfo & {link: string, src: string}; 

@Component({
  selector: "advert-carousel-ui",
  templateUrl: "./advert-carousel.component.html",
  styleUrls: ['./advert-carousel.component.css'],
  imports: [
    AdvertBannerComponent
  ]
})
export class AdvertCarouselComponent implements OnInit, OnDestroy {
  @Input() adverts: TAdvertCarouselInfo[] = [];

  private TIMER_INTERVAL = 10000;

  currentIndex = signal<number>(1);

  position = "translateX(0)"

  intervalTimer!: Subscription;

  elementRef: ElementRef;

  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
  }


  ngOnInit() {
    this.intervalTimer = timer(this.TIMER_INTERVAL, this.TIMER_INTERVAL).subscribe(() => {
      this.currentIndex.set((this.currentIndex() + 1) % this.adverts.length);
      const elem = this.elementRef.nativeElement.querySelector(".advert-carousel__item--active");
      const bodyWidth = this.elementRef.nativeElement.offsetWidth;
      if(!elem) {
        this.position = `translateX(-${bodyWidth / 2}px)`;
        return;
      }
      if(this.currentIndex() === 0) {
        this.position = `translateX(${bodyWidth / 2 - elem.offsetWidth / 2}px)`;
        return;
      } 
      const offset = elem.offsetWidth * this.currentIndex() - (bodyWidth / 2 - elem.offsetWidth / 2);
      
      this.position = `translateX(-${offset}px)`;
    });
  }

  ngOnDestroy() {
    if (this.intervalTimer) {
      this.intervalTimer.unsubscribe();
    }
  }

  bannerClasses(index: number) {
    return {
      "advert-carousel__item": true,
      "advert-carousel__item--inactive": index !== this.currentIndex(),
      "advert-carousel__item--active": index === this.currentIndex()
    }
  }

  get isActiveFirst() {
    return this.currentIndex() === 0; 
  }

  get isActiveLast() {
    return this.currentIndex() === this.adverts.length - 1;
  }

  get lastAdvert() {
    return this.adverts[this.adverts.length - 1];
  }

  get prevAdvert() {
    return this.adverts[(this.currentIndex() - 1) % this.adverts.length];
  }

  get nextAdvert() {
    return this.adverts[(this.currentIndex() + 1) % this.adverts.length];
  }

  get currentAdvert() {
    return this.adverts[this.currentIndex()];
  }
}