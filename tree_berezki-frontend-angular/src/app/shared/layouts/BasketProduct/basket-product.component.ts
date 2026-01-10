import { Component, Input, Output, EventEmitter } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CurrencyPipe } from "@angular/common";

import { ImageComponent } from "../../ui/Image/image.component";
import { TextComponent } from "../../ui/Text/text.component";
import { ButtonComponent } from "../../ui/Button/button.component";
import { ButtonBasketCounterComponent } from "../../ui/ButtonBasketCounter/button-basket-counter.component";
import { ButtonDeleteBasketComponent } from "../../ui/ButtonDeleteBasket/button-delete-basket.component";
import { ButtonShareComponent } from "../../ui/ButtonShare/button-share.component";
import { SelectDotComponent } from "../../ui/SelectDot/select-dot.component";
import { ButtonLikeComponent } from "../../ui/ButtonLike/button-like.component";
import { ButtonVerticalArrowComponent } from "../../ui/ButtonVerticalArrow/button-vertical-arrow.component";

export type TBasketProductImage = {
  src: string;
  alt: string;
}

export type TBasketProduct = {
  id: string;
  title: string;
  images: TBasketProductImage[];
  price: number;
  discount: number;
  addedCount: number;
  maxCount: number;
}

@Component({
  selector: "basket-product-layout",
  templateUrl: "./basket-product.component.html",
  styleUrls: ["./basket-product.component.css"],
  imports: [
    ImageComponent,
    TextComponent,
    ButtonComponent,
    ButtonBasketCounterComponent,
    ButtonDeleteBasketComponent,
    ButtonShareComponent,
    SelectDotComponent,
    RouterLink,
    ButtonLikeComponent,
    CurrencyPipe,
    ButtonVerticalArrowComponent
  ],
  standalone: true,
})
export class BasketProductComponent {
  @Input() product: TBasketProduct = {
    id: "",
    title: "",
    images: [],
    price: 0,
    discount: 0,
    addedCount: 1,
    maxCount: 1
  };
  @Input() productUrl: string = "";
  @Input() isSelected: boolean = false;
  @Input() isLiked: boolean = false;

  @Output() onDelete = new EventEmitter<TBasketProduct>();
  @Output() onShare = new EventEmitter<TBasketProduct>();
  @Output() onLike = new EventEmitter<TBasketProduct>();
  @Output() onAdd = new EventEmitter<TBasketProduct>();
  @Output() onRemove = new EventEmitter<TBasketProduct>();
  @Output() onToggleSelect = new EventEmitter<TBasketProduct>();
  @Output() onClickBuy = new EventEmitter<TBasketProduct>();

  get priceWithoutDiscount() {
    return this.product.price * (1 + this.product.discount / 100);
  }

  onSelectClick() {
    this.onToggleSelect.emit(this.product);
  }

  onDeleteClick() {
    this.onDelete.emit(this.product);
  }

  onShareClick() {
    this.onShare.emit(this.product);
  }

  onLikeClick() {
    this.onLike.emit(this.product);
  }

  onBuyClick() {
    this.onClickBuy.emit(this.product);
  }

  onClickAdd() {
    this.onAdd.emit(this.product);
  }

  onClickRemove() {
    this.onRemove.emit(this.product);
  }

  get imageSrc() {
    return this.product.images[0].src;
  }

  get imageAlt() {
    return this.product.images[0].alt;
  }
}