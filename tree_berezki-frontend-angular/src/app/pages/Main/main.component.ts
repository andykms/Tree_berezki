import { Component, Input, Output, EventEmitter } from "@angular/core";

import { SearchComponent } from "../../shared/ui/Search/search.component";
import { AdvertCarouselComponent } from "../../shared/ui/AdvertCarousel/advert-carousel.component";
import { ProductFeedComponent } from "../../shared/layouts/ProductFeed/product-feed.component";
import { MenuMobileComponent } from "../../shared/ui/MenuMobile/menu-mobile.component";
import { ButtonUpComponent } from "../../shared/ui/ButtonUp/button-up.component";
import { MenuDesktopComponent } from "../../shared/ui/MenuDesktop/menu-desktop.component";

import { ScrollUpDirective } from "../../shared/directives/scroll-up.directive";

export type TProductImageMainPage = {
  src: string;
  alt: string;
}

export type TProductMainPage = {
  id: string;
  title: string;
  shop: string;
  images: TProductImageMainPage[];
  rating: number;
  price: number;
  discount: number;
  countRating: number;
  addedCount: number;
  isLiked: boolean;
}

export type TAdvertMainPage = {
  INN: string;
  organization: string;
  link: string;
  src: string;
}

@Component({
  selector: "main-page",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"],
  imports: [
    SearchComponent,
    AdvertCarouselComponent,
    ProductFeedComponent,
    MenuMobileComponent,
    ButtonUpComponent,
    ScrollUpDirective,
    MenuDesktopComponent
  ]
})
export class MainComponent {
  @Input() products: TProductMainPage[] = [];
  @Input() adverts: TAdvertMainPage[] = [];

  @Input() isLoading: boolean = false;
  @Input() hasMore: boolean = false;
  @Output() loadMore = new EventEmitter<void>();
  @Output() onLike = new EventEmitter<{id: string}>();
  @Output() onAdd = new EventEmitter<{id: string}>();
  @Output() onClick = new EventEmitter<{id: string}>();
  @Output() onSearch = new EventEmitter<string>();

  isVisibleButtonUp = false;

  onScrollUp() {
    this.isVisibleButtonUp = true;
  }
  onScrollDown() {
    this.isVisibleButtonUp = false;
  }

  onClickButtonUp() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  onClickLike(product: TProductMainPage) {
    this.onLike.emit(product);
  }
  onClickAdd(product: TProductMainPage) {
    this.onAdd.emit(product);
  }
  onClickProduct(product: TProductMainPage) {
    this.onClick.emit(product);
  }
  onSearchProduct(search: string) {
    this.onSearch.emit(search);
  }

  onLoadMore() {
    if (this.hasMore) {
      this.loadMore.emit();
    }
  }
}