import { Component, Input, Output, EventEmitter } from "@angular/core";

import { ButtonComponent } from "../Button/button.component";
import { ButtonType } from "../Button/button.component";

export type ButtonLikeType = "small" | "large";
export type ButtonFormType = "base" | "tertiary" | "primary";

@Component({
  imports: [
    ButtonComponent
  ],
  selector: "button-like-ui",
  templateUrl: "./button-like.component.html",
  styleUrls: ["./button-like.component.css"]
})
export class ButtonLikeComponent {
  @Input() isLiked: boolean = false;
  @Input() type: ButtonLikeType = "small";
  @Input() form: ButtonFormType = "tertiary";
  @Output() onClick = new EventEmitter<void>();

  toggle() {
    this.onClick.emit();
  }

  get buttonLikeClasses() {
    return {
      "button-like": true,
      [this.type]: true
    };
  }

  get iconWidth() {
    return this.type === "small" ? "20px" : "31px";
  }

  get iconHeight() {
    return this.type === "small" ? "20px" : "31px";
  }

  get fill() {
    return this.isLiked ? (this.form === "primary" ? "var(--primary)": "var(--text)"): "transparent";
  }

  get outline() {
    return this.form === "primary" ? "var(--primary)" : "var(--text)";
  }

  get buttonType(): ButtonType {
    return this.form === "tertiary" ? "tertiary": "empty";
  }
}