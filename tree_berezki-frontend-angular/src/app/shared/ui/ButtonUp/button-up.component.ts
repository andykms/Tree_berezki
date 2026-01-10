import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ButtonComponent } from "../Button/button.component";

@Component({
  imports: [
    ButtonComponent
  ],
  selector: "button-up-ui",
  templateUrl: "./button-up.component.html",
  styleUrls: ["./button-up.component.css"]
})
export class ButtonUpComponent {
  @Output() onClick = new EventEmitter<void>();
  @Input() visible = true;

  
  onClickButton() {
    this.onClick.emit();
  }
}