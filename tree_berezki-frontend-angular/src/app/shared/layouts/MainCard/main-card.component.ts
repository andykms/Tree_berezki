import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CurrencyPipe, DecimalPipe } from "@angular/common";

import { CountFormatPipe } from "../../pipes/count-format.pipe";
import { ImageCarouselComponent } from "../../ui/ImageCarousel/image-carousel.component";
import { ButtonComponent } from "../../ui/Button/button.component";
import { TextComponent } from "../../ui/Text/text.component";
import { ButtonAddBasketComponent } from "../../ui/ButtonAddBasketMobile/button-add-basket.component";
import { PositionDotsComponent } from "../../ui/PositionDots/position-dots.component";
import { ButtonLikeComponent } from "../../ui/ButtonLike/button-like.component";
import { ButtonVerticalArrowComponent } from "../../ui/ButtonVerticalArrow/button-vertical-arrow.component";


export type Image = {
  src: string;
  alt: string;
}

@Component({
  imports: [
    ImageCarouselComponent,
    ButtonComponent,
    TextComponent,
    ButtonAddBasketComponent,
    PositionDotsComponent,
    ButtonLikeComponent,
    ButtonVerticalArrowComponent,
    CurrencyPipe,
    DecimalPipe,
    CountFormatPipe
  ],
  selector: "main-card-layout",
  templateUrl: "./main-card.component.html",
  styleUrls: ["./main-card.component.css"]
})
export class MainCardComponent {
  @Input() title: string = "";
  @Input() shop: string = "";
  @Input() images: Image[] = [];
  @Input() rating: number = 0;
  @Input() price: number = 0;
  @Input() discount: number = 0;
  @Input() countRating: number = 0;
  @Input() addedCount: number = 0;
  @Input() isLiked: boolean = false;
  @Output() onLike: EventEmitter<void> = new EventEmitter();
  @Output() onAdd: EventEmitter<void> = new EventEmitter();
  @Output() onClick: EventEmitter<void> = new EventEmitter();

  activeImage = 0;

  clickAdd() {
    this.onAdd.emit();
  }

  toggleLike() {
    this.onLike.emit();
  }

  toggleClick() {
    this.onClick.emit();
  }

  nextImage() {
    this.activeImage = (this.activeImage + 1) % this.images.length;
  }

  prevImage() {
    this.activeImage = (this.activeImage - 1 + this.images.length) % this.images.length;
  }

  get currentImageSrc() {
    return this.images[this.activeImage].src;
  }

  get currentImageAlt() {
    return this.images[this.activeImage].alt;
  }

  get countImages() {
    return this.images.length;
  }

  get isAdded() {
    return this.addedCount > 0;
  }

  changeImage(index: number) {
    this.activeImage = index;
  }

  get oldPrice() {
    return this.price * (1 + this.discount / 100);
  }

  get countRatingText() {
    return this.countRating.toString();
  }
}

