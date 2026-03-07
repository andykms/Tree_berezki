import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MainCardComponent } from './shared/layouts/MainCard/main-card.component';
import { InputShelfComponent } from './shared/ui/InputShelf/input-shelf.component';
import { InputCodeComponent } from './shared/ui/InputCode/input-code.component';
import { SelectDropdownComponent } from './shared/ui/SelectDropdown/select-dropdown.component';
import {
  BasketProductComponent,
  TBasketProduct,
} from './shared/layouts/BasketProduct/basket-product.component';
import { CommentComponent, TComment } from './shared/layouts/Comment/comment.component';
import { FormLoginComponent } from './shared/layouts/FormLogin/form-login.component';
import { FormCreatePasswordComponent } from './shared/layouts/FormCreatePassword/form-create-password.component';
import { AdvertCarouselComponent } from './shared/ui/AdvertCarousel/advert-carousel.component';
import { MainComponent } from './pages/Main/main.component';
import { mockProducts } from './core/utils/mock-products';

@Component({
  imports: [
    MainCardComponent,
    InputShelfComponent,
    FormsModule,
    ReactiveFormsModule,
    InputCodeComponent,
    SelectDropdownComponent,
    BasketProductComponent,
    RouterLink,
    CommentComponent,
    FormLoginComponent,
    FormCreatePasswordComponent,
    AdvertCarouselComponent,
    MainComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  currIndex = 10;

  products = mockProducts.slice(0, this.currIndex);

  adverts = [
    {
      organization: 'ПАО Берибанк',
      INN: '7707083893',
      link: '/',
      src: 'https://i.pinimg.com/originals/ca/9a/12/ca9a123b7269fba0574726629bad42b9.jpg',
    },
    {
      organization: 'ООО КибоБР',
      INN: '5523083893',
      link: '/',
      src: 'https://i.pinimg.com/originals/42/68/7e/42687eab36aac1e51c36c910b01ac64f.jpg',
    },
    {
      organization: 'ООО Тмыв',
      INN: '55765838452',
      link: '/',
      src: 'https://i.pinimg.com/originals/6a/d6/d8/6ad6d8fdff9b1e47e4423011c66c413b.jpg',
    },
    {
      organization: 'ООО Лух',
      INN: '55765838452',
      link: '/',
      src: 'https://i.pinimg.com/originals/c7/dd/22/c7dd22b588ca841e83b5a04240d04795.jpg',
    },
    {
      organization: 'ООО Первоцвет',
      INN: '55765838452',
      link: '/',
      src: 'https://images.wallpaperscraft.ru/image/single/fon_abstraktsiia_sinij_1308170_3840x2400.jpg',
    },
  ];

  onLikeProduct = (product: { id: string }) => {
    this.products = this.products.map((p) => ({
      ...p,
      isLiked: p.id === product.id ? !p.isLiked : p.isLiked,
    }));
  };

  onAddProduct = (product: { id: string }) => {};

  onClickProduct = (product: { id: string }) => {};

  onSearchProduct = (query: string) => {};

  loadMore = () => {
    this.currIndex += 10;
    if(this.currIndex > mockProducts.length) {
      return;
    }
    this.products = mockProducts.slice(0, this.currIndex);
  }

  get hasMore() {
    return mockProducts.length > this.products.length;
  }

  get isLoading() {
    return false;
  }

  onSubmitFormCreatePassword = (form: { password: string }) => {};
  createPasswordServerError = '';

  serverError = '';

  onSubmitFormLogin = (form: { phone: string; password: string }) => {
    if (form.password !== '123456') {
      this.serverError = 'Неверный логин/пароль';
    }
  };

  comment: TComment = {
    id: 'ioogn34g',
    advantage:
      'сразу врубается, по анализам видно что не метан и не мука, залетает с лигандролом, от соло курса эффекта почти нет (но так и должно быть)',
    disadvantage: 'недостатков нет, работает как надо',
    comment:
      'Эффект начинается через 3-4 недели, поэтому ждём. Если не борщить и пить параллельно очищающие печень препараты, то побочки можно избежать, но все индивидуально',
    rating: 4,
    likes: 11,
    dislikes: 32,
    replies: 19,
    date: new Date('2019-01-15'),
    senderName: 'Александр Петров',
    images: [
      {
        src: 'https://feedback-03.wbbasket.ru/6e81b5c4-0662-48d7-b7ff-08c7ebf7c4f2/ms.webp',
        alt: 'Фото товара 1',
      },
      {
        src: 'https://feedback-01.wbbasket.ru/699e1d96-1ba4-4644-9bdf-51b0901f021f/ms.webp',
        alt: 'Фото товара 2',
      },
    ],
    productImageSrc:
      'https://ekt-basket-cdn-08.geobasket.ru/vol2212/part221290/221290689/images/big/1.webp',
    choosenParams: [
      { name: 'Цвет', value: 'Черный' },
      { name: 'Размер', value: 'XL' },
      { name: 'Материал', value: 'Хлопок' },
    ],
  };
  commentWidth = '600px';
  commentIsLiked = false;
  commentIsDisliked = false;
  shopReply =
    'Здравствуйте! Нам очень жаль, что Вы столкнулись с подобными проблемами при использовании данной модели. Надеемся, следующие покупки будут приятными. С уважением, Илья, команда Спортмастер.';
  commentOptions = ['Пожаловаться'];
  commentOnLike = () => {
    this.commentIsLiked = !this.commentIsLiked;
    if (this.commentIsLiked) {
      this.commentIsDisliked = false;
    }
  };

  commentOnDislike = () => {
    this.commentIsDisliked = !this.commentIsDisliked;
    if (this.commentIsDisliked) {
      this.commentIsLiked = false;
    }
  };

  commentOnReply = () => {};

  onClickCommentOption = (comment: TComment, option: number) => {
    alert(this.commentOptions[option]);
  };

  basketWidth = '70%';

  options = ['Полезные', 'Старые', 'Новые', 'С высокой оценкой', 'С низкой оценкой'];

  selectedDropdown = 0;

  basketProducts = [
    {
      id: 'iognerignoerierg53g093gh3g8h',
      title: 'Футболка поло мужская с коротким рукавом',
      images: [
        {
          src: 'https://ekt-basket-cdn-09.geobasket.ru/vol2095/part209561/209561630/images/big/1.webp',
          alt: 'Image 1',
        },
      ],
      price: 651,
      discount: 57,
      addedCount: 2,
      maxCount: 10,
    },
  ];

  basketProductUrl = '/';
  isSelectedBasketProduct = false;
  isLikedBasketProduct = false;

  onDeleteBasketProduct(product: TBasketProduct) {
    this.basketProducts = this.basketProducts.filter((p) => p.id !== product.id);
  }

  onShareBasketProduct(product: TBasketProduct) {}

  onLikeBasketProduct(product: TBasketProduct) {
    this.isLikedBasketProduct = !this.isLikedBasketProduct;
  }

  onAddBasketProduct(product: TBasketProduct) {
    const findedProduct = this.basketProducts.find((p) => p.id === product.id);
    if (findedProduct && findedProduct.addedCount < findedProduct.maxCount) {
      findedProduct.addedCount += 1;
    }
  }

  onRemoveBasketProduct(product: TBasketProduct) {
    if (product.addedCount > 0) {
      product.addedCount -= 1;
    }
  }

  onToggleSelectBasketProduct(product: TBasketProduct) {
    this.isSelectedBasketProduct = !this.isSelectedBasketProduct;
  }

  onBuyBasketProduct(product: TBasketProduct) {}

  onChangeDropdown(index: number) {
    this.selectedDropdown = index;
  }

  formControlNames = ['code1', 'code2', 'code3', 'code4', 'code5', 'code6'];

  text: string = '';

  isLiked = false;
  onLike = () => {
    this.isLiked = !this.isLiked;
  };
  addedCount = 0;
  onAdd = () => (this.addedCount += 1);

  myForm = new FormGroup({
    userName: new FormControl('Tom', Validators.required),
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    userPhone: new FormControl('', Validators.pattern('[0-9]{11}')),
  });

  images = [
    {
      src: 'https://ekt-basket-cdn-10.geobasket.ru/vol1666/part166648/166648461/images/big/1.webp',
      alt: 'Image 1',
    },
    {
      src: 'https://ekt-basket-cdn-10.geobasket.ru/vol1666/part166648/166648461/images/big/2.webp',
      alt: 'Image 2',
    },
    {
      src: 'https://ekt-basket-cdn-10.geobasket.ru/vol1666/part166648/166648461/images/big/3.webp',
      alt: 'Image 3',
    },
    {
      src: 'https://ekt-basket-cdn-10.geobasket.ru/vol1666/part166648/166648461/images/big/4.webp',
      alt: 'Image 4',
    },
    {
      src: 'https://ekt-basket-cdn-10.geobasket.ru/vol1666/part166648/166648461/images/big/5.webp',
      alt: 'Image 5',
    },
    {
      src: 'https://ekt-basket-cdn-10.geobasket.ru/vol1666/part166648/166648461/images/big/6.webp',
      alt: 'Image 6',
    },
    {
      src: 'https://ekt-basket-cdn-10.geobasket.ru/vol1666/part166648/166648461/images/big/7.webp',
      alt: 'Image 7',
    },
  ];
}
