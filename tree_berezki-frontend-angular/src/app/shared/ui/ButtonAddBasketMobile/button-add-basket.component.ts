import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ButtonComponent } from "../Button/button.component";
import { CounterComponent } from "../Counter/counter.component";

@Component({
  imports: [
    ButtonComponent,
    CounterComponent
  ],
  selector: "button-add-basket-ui",
  templateUrl: "./button-add-basket.component.html",
  styleUrls: ["./button-add-basket.component.css"]
})
export class ButtonAddBasketComponent {

  @Input() addedCount = 0;
  @Input() isAdded = false;
  @Output() onClick = new EventEmitter<void>();


  toggle() {
    this.onClick.emit();
  }
}
