import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ButtonComponent } from "../Button/button.component";

export type ButtonVerticalArrowType = "left" | "right";

@Component({
  selector: "button-vertical-arrow-ui",
  templateUrl: "./button-vertical-arrow.component.html",
  styleUrls: ["./button-vertical-arrow.component.css"],
  imports: [ButtonComponent],
})
export class ButtonVerticalArrowComponent {
  @Output() onClick = new EventEmitter<void>();
  @Input() type: ButtonVerticalArrowType = "left";

  onClickButton() {
    this.onClick.emit();
  }

  get containerClasses() {
    return {
      [this.type]: true,
    };
  }
}