import { Component, Input, Output, EventEmitter, AfterViewInit } from "@angular/core";
import { MainCardComponent } from "../MainCard/main-card.component";
import { InfiniteScrollDirective, InfiniteScrollConfig } from "../../directives/infinite-scroll.directive";


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



@Component({
  imports: [
    InfiniteScrollDirective,
    MainCardComponent
  ],
  selector: "product-feed-layout",
  templateUrl: "./product-feed.component.html",
  styleUrls: ["./product-feed.component.css"]
})
export class ProductFeedComponent implements AfterViewInit{
  @Input() products: TProduct[] = [];
  @Input() isLoading = false;
  @Input() hasMore = true;

  @Output() onLike = new EventEmitter<TProduct>();
  @Output() onAdd = new EventEmitter<TProduct>();
  @Output() onClick = new EventEmitter<TProduct>();
  @Output() loadMore = new EventEmitter<void>();


  ngAfterViewInit(): void {
    // Проверяем начальное состояние - если контент не заполняет страницу
    setTimeout(() => this.checkInitialLoad(), 0);
  }

  private checkInitialLoad(): void {
    const element = document.querySelector('.virtual-scroll');
    if (element) {
      const windowHeight = window.innerHeight;
      const elementHeight = element.clientHeight;
      
      // Если контент меньше высоты окна и есть еще данные для загрузки
      if (elementHeight < windowHeight && this.hasMore && !this.isLoading) {
        this.loadMore.emit();
      }
    }
  }

  get infiniteScrollConfig(): InfiniteScrollConfig {
    return {threshold:300}
  };

  onClickLike(product: TProduct) {
    this.onLike.emit(product);
  }

  onClickAdd(product: TProduct) {
    this.onAdd.emit(product);
  }

  onClickProduct(product: TProduct) {
    this.onClick.emit(product);
  }

  trackById(index: number, product: TProduct) {
    return product.id;
  }

  onLoadMore(): void {
    if (this.isLoading || !this.hasMore) {
      return;
    }
    
    this.loadMore.emit();
  }
}