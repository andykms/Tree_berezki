import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ButtonComponent } from "../Button/button.component";
import { TextComponent } from "../Text/text.component";

@Component({
  imports: [ButtonComponent, TextComponent],
  selector: "button-add-basket-full-ui",
  templateUrl: "./button-add-basket-full.component.html",
  styleUrls: ["./button-add-basket-full.component.css"]
})
export class ButtonAddBasketFullComponent {
  @Input() addedCount = 0;
  @Input() maxCount = 1;
  @Output() onAdd = new EventEmitter<void>();
  @Output() onRemove = new EventEmitter<void>();

  onClickAdd() {
    this.onAdd.emit();
  }

  onClickRemove() {
    this.onRemove.emit();
  }

  get isAdded() {
    return this.addedCount > 0;
  }

  get isDisabledAdd() {
    return this.addedCount >= this.maxCount;
  }
}