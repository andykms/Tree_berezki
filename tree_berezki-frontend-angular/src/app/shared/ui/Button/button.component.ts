import { Component, Input, Output, EventEmitter } from "@angular/core";

export type ButtonType = "primary" | "secondary" | "tertiary" | "liquid";

// Зеленый, серый, 
@Component({
  selector: "button-ui",
  templateUrl: "./Button.component.html",
  styleUrls: ["./Button.component.css"]
})
export class ButtonComponent {
  @Input() type: ButtonType = "secondary";
  @Output() onClick = new EventEmitter<void>();

  get buttonClasses() {
    const classes: { [key: string]: boolean } = {
      "button": true
    };
    classes[this.type] = true;
    return classes;
  }

  clickEvent() {
    this.onClick.emit();
  }
}