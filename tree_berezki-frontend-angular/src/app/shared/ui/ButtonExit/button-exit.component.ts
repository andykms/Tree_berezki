import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ButtonComponent } from "../Button/button.component";
import { ButtonType } from "../Button/button.component";

export type ButtonExitType = "base" | "tertiary" | "primary";

@Component({
  imports: [
    ButtonComponent
  ],
  selector: "button-exit-ui",
  templateUrl: "./button-exit.component.html",
  styleUrls: ["./button-exit.component.css"]
})
export class ButtonExitComponent {
  @Input() type: ButtonExitType = "base";
  @Output() onClick = new EventEmitter<void>();

  onClickButton() {
    this.onClick.emit();
  }

  get buttonType(): ButtonType {
    return this.type === "tertiary" ? "tertiary" : "empty";
  }

  get outline() {
    return this.type === "primary" ? "var(--primary)" : "var(--text)";
  }
}