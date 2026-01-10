import {Component, Input, Output, EventEmitter} from '@angular/core';
import { CurrencyPipe } from "@angular/common";

import { TextComponent } from '../Text/text.component';
import { ButtonComponent } from '../Button/button.component';


@Component({
  imports: [TextComponent, ButtonComponent, CurrencyPipe],
  selector: "button-to-place-order-ui",
  templateUrl: "./button-to-place-order.component.html",
  styleUrls: ["./button-to-place-order.component.css"]
})
export class ButtonToPlaceOrderComponent {
  @Input() count = 0;
  @Input() summ = 0;
  @Output() onClick = new EventEmitter<void>();

  onClickButton() {
    this.onClick.emit();
  }

  get isDisabled() {
    return this.count <= 0 || this.summ <= 0;
  }
}