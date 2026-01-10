import {Component, Input} from '@angular/core';
import { MouseEnterDirective } from '../../directives/mouse-enter.directive';
import { TextComponent } from '../Text/text.component';
import { BodyComponent } from '../Body/body.component';

export type TAdvertInfo = {
  organization: string;
  INN: string;
}

@Component({
  imports: [MouseEnterDirective, TextComponent, BodyComponent],
  selector: "advert-info-ui",
  templateUrl: "./advert-info.component.html",
  styleUrls: ["./advert-info.component.css"]
})
export class AdvertInfoComponent {
  @Input() title = "Реклама";
  @Input() advertInfo: TAdvertInfo = {
    organization: "",
    INN: ""
  };

  isWatchInfo = false;

  onMouseEnterTitle() {
    this.isWatchInfo = true;
  }

  onMouseLeaveTitle() {
    this.isWatchInfo = false;
  }
}