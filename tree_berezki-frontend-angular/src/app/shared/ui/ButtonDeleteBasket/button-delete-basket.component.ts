import { Component, Output, EventEmitter } from "@angular/core";
import { ButtonComponent } from "../Button/button.component";

@Component({
  imports: [ButtonComponent],
  selector: "button-delete-basket-ui",
  templateUrl: "./button-delete-basket.component.html",
  styleUrls: ["./button-delete-basket.component.css"]
})
export class ButtonDeleteBasketComponent {
  @Output() onClick = new EventEmitter<void>();

  onClickButton() {
    this.onClick.emit();
  }

  get outline() {
    return "var(--on-light-text)";
  }
}