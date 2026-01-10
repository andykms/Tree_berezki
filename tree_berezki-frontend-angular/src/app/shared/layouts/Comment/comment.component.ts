import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ButtonComponent } from '../../ui/Button/button.component';
import { TextComponent } from '../../ui/Text/text.component';
import { StarsComponent } from '../../ui/Stars/stars.component';
import { MenuDropdownComponent } from '../../ui/MenuDropdown/menu-dropdown.component';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { CountFormatPipe } from '../../pipes/count-format.pipe';
import { TextDropdownComponent } from '../../ui/TextDropdown/text-dropdown.component';
import { ImageCarouselComponent } from '../../ui/ImageCarousel/image-carousel.component';

export type TCommentType = 'base' | 'empty';

export type TCommentImage = {
  src: string;
  alt: string;
};

export type TProductCommentParam = {
  name: string;
  value: string;
};

export type TComment = {
  id: string;
  advantage: string;
  disadvantage: string;
  comment: string;
  rating: number;
  likes: number;
  dislikes: number;
  replies: number;
  date: Date;
  senderName: string;
  images: TCommentImage[];
  productImageSrc: string;
  choosenParams: TProductCommentParam[];
};

@Component({
  imports: [
    ButtonComponent,
    TextComponent,
    StarsComponent,
    DateFormatPipe,
    MenuDropdownComponent,
    CountFormatPipe,
    TextDropdownComponent,
    ImageCarouselComponent,
  ],
  selector: 'comment-layout',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent {
  @Input() comment: TComment = {
    id: '',
    advantage: '',
    disadvantage: '',
    comment: '',
    rating: 0,
    likes: 0,
    dislikes: 0,
    replies: 0,
    date: new Date(),
    senderName: '',
    images: [],
    productImageSrc: '',
    choosenParams: [],
  };
  @Input() isLiked = false;
  @Input() isDisliked = false;
  @Input() shopReply: string = '';
  @Input() type: TCommentType = 'base';
  @Input() options: string[] = [];
  @Output() onLike = new EventEmitter<TComment>();
  @Output() onDislike = new EventEmitter<TComment>();
  @Output() onClickReply = new EventEmitter<TComment>();
  @Output() onClickCommentOption = new EventEmitter<{ comment: TComment; option: number }>();

  onClickLike() {
    this.onLike.emit(this.comment);
  }

  onClickOption(option: number) {
    this.onClickCommentOption.emit({
      comment: this.comment,
      option,
    });
  }

  onClickDislike() {
    this.onDislike.emit(this.comment);
  }

  onClickReplyButton() {
    this.onClickReply.emit(this.comment);
  }

  get commentClasses() {
    return {
      comment__container: true,
      [this.type]: true,
    };
  }

  get commentDate() {
    return this.comment.date.toISOString();
  }

  get hasOptions() {
    return this.options.length > 0;
  }

  get svgLikeBorderFill() {
    const res = this.isLiked ? 'var(--text)' : 'var(--sub-text)';
    return res;
  }

  get svgLikeFill() {
    const res = this.isLiked ? 'var(--text)' : 'transparent';
    return res;
  }

  get svgDislikeBorderFill() {

    return this.isDisliked ? 'var(--text)' : 'var(--sub-text)';
  }

  get svgDislikeFill() {
    return this.isDisliked ? 'var(--text)' : 'transparent';
  }

  get hasShopReply() {
    return Boolean(this.shopReply);
  }

  get textDislikes() {
    return this.comment.dislikes.toString();
  }

  get textReplies() {
    return this.comment.replies.toString();
  }

  get textLikes() {
    return this.comment.likes.toString();
  }
}
