import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MainCardComponent } from "../MainCard/main-card.component";

export type TProductImage = {
  src: string;
  alt: string;
}

export type TProduct = {
  id: string;
  title: string;
  shop: string;
  images: TProductImage[];
  rating: number;
  price: number;
  discount: number;
  countRating: number;
  addedCount: number;
  isLiked: boolean;
}

export type TProductViewType = "mobile" | "desktop";


@Component({
  imports: [
    ScrollingModule,
    MainCardComponent
  ],
  selector: "product-feed-layout",
  templateUrl: "./product-feed.component.html",
  styleUrls: ["./product-feed.component.css"]
})
export class ProductFeedComponent {
  @Input() products: TProduct[] = [];
  @Input() viewType: TProductViewType = "mobile";
  @Output() onLike = new EventEmitter<TProduct>();
  @Output() onAdd = new EventEmitter<TProduct>();
  @Output() onClick = new EventEmitter<TProduct>();

  onClickLike(product: TProduct) {
    this.onLike.emit(product);
  }

  onClickAdd(product: TProduct) {
    this.onAdd.emit(product);
  }

  onClickProduct(product: TProduct) {
    this.onClick.emit(product);
  }
}