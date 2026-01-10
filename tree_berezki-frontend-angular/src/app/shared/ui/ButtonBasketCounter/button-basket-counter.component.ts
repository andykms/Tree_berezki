import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ButtonComponent } from "../Button/button.component";
import { TextComponent, TextType } from "../Text/text.component";

@Component({
  imports: [ButtonComponent, TextComponent],
  selector: "button-basket-counter-ui",
  templateUrl: "./button-basket-counter.component.html",
  styleUrls: ["./button-basket-counter.component.css"]
})
export class ButtonBasketCounterComponent {
  @Input() count = 0;
  @Input() maxCount = 1;
  @Output() onAdd = new EventEmitter<void>();
  @Output() onRemove = new EventEmitter<void>();

  onClickAdd() {
    this.onAdd.emit();
  }

  onClickRemove() {
    this.onRemove.emit();
  }

  get isDisabledAdd() {
    return this.count >= this.maxCount;
  }

  get isDisabledRemove() {
    return this.count <= 1;
  }

  get textRemoveType(): TextType {
    return this.isDisabledRemove ? "sub" : "primary";
  }

  get textAddType(): TextType {
    return this.isDisabledAdd ? "sub" : "primary";
  }
}