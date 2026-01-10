import {Component, Input, Output, EventEmitter, ElementRef} from '@angular/core';

import { ImageComponent } from '../Image/image.component';
import { ButtonVerticalArrowComponent } from '../ButtonVerticalArrow/button-vertical-arrow.component';

export type TImageCarouselType = "base" | "vitrine";
export type TImageCarouselForm = "base" | "rounded";

export type TImage = {
  src: string;
  alt: string;
}

@Component({
  selector: "image-carousel-ui",
  templateUrl: "./image-carousel.component.html",
  styleUrls: ["./image-carousel.component.css"],
  imports: [
    ImageComponent,
    ButtonVerticalArrowComponent
  ]
})
export class ImageCarouselComponent {
  @Input() images: TImage[] = [];
  @Input() imageWidth: string = "auto";
  @Input() imageHeight: string = "auto";
  @Input() imageMaxHeight: string = "100%";
  @Input() windowWidth: string = "100%";
  @Input() windowHeight: string = "100%";
  @Input() type: TImageCarouselType = "base";
  @Input() form: TImageCarouselForm = "base";
  @Output() onClick = new EventEmitter<number>();

  element: ElementRef;

  constructor(element: ElementRef) {
    this.element = element;
  }

  currentIndex = 0;

  onImageClick(index: number) {
    if (this.onClick) {
      this.onClick.emit(index);
    }
  }

  onNextClick() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.scrollTo();
  }

  onPrevClick() {
    this.currentIndex = this.currentIndex - 1;
    if (this.currentIndex < 0) {
      this.currentIndex = this.images.length - 1;
    }
    this.scrollTo();
  }

  private scrollTo() {
    this.element.nativeElement.querySelector(".image-carousel__container").scrollTo({
      top: 0,
      left: this.currentIndex * this.element.nativeElement.offsetWidth,
      behavior: "smooth",
    })
  }
}