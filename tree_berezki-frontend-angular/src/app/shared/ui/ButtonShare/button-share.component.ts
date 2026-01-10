import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ButtonComponent, ButtonType } from "../Button/button.component";


export type ButtonShareType = "base" | "primary" | "tertiary"

@Component({
  imports: [
    ButtonComponent
  ],
  selector: "button-share-ui",
  templateUrl: "./button-share.component.html",
  styleUrls: ["./button-share.component.css"]
})
export class ButtonShareComponent {
  @Input() type: ButtonShareType = "base";
  @Output() onClick = new EventEmitter<void>();

  onClickEvent() {
    this.onClick.emit();
  }

  get buttonType(): ButtonType {
    return this.type === "tertiary" ? "tertiary" : "empty";  
  }

  get outline() {
    return this.type === "primary" ? "var(--primary)" : "var(--text)";
  }
}