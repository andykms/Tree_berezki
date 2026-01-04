import { Component } from "@angular/core";
import { MainCardComponent } from "./shared/layouts/MainCard/main-card.component";


@Component({
  imports: [
    MainCardComponent
  ],
  selector: "app-root",
  templateUrl: "./app.component.html"
})
export class AppComponent {
  isLiked = false;
  onLike = () => {
    this.isLiked = !this.isLiked;
  }
  addedCount = 0;
  onAdd = () => this.addedCount += 1;

  images = [
    {
      src: "https://ekt-basket-cdn-10.geobasket.ru/vol1666/part166648/166648461/images/big/1.webp",
      alt: "Image 1"
    },
    {
      src: "https://ekt-basket-cdn-10.geobasket.ru/vol1666/part166648/166648461/images/big/2.webp",
      alt: "Image 2"
    }, 
    {
      src: "https://ekt-basket-cdn-10.geobasket.ru/vol1666/part166648/166648461/images/big/3.webp",
      alt: "Image 3"
    },
    {
      src: "https://ekt-basket-cdn-10.geobasket.ru/vol1666/part166648/166648461/images/big/4.webp",
      alt: "Image 4"
    },
    {
      src: "https://ekt-basket-cdn-10.geobasket.ru/vol1666/part166648/166648461/images/big/5.webp",
      alt: "Image 5"
    },
    {
      src: "https://ekt-basket-cdn-10.geobasket.ru/vol1666/part166648/166648461/images/big/6.webp",
      alt: "Image 6"
    },
    {
      src: "https://ekt-basket-cdn-10.geobasket.ru/vol1666/part166648/166648461/images/big/7.webp",
      alt: "Image 7"
    }
  ]
}