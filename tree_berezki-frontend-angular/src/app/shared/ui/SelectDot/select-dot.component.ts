import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ButtonComponent } from "../Button/button.component";

@Component({
  imports: [ButtonComponent],
  selector: "select-dot-ui",
  templateUrl: "./select-dot.component.html",
  styleUrls: ["./select-dot.component.css"]
})
export class SelectDotComponent {
  @Input() selected = false;
  @Output() onClick = new EventEmitter<void>();

  onClickButton() {
    this.onClick.emit();
  }

  get selectDotClasses() {
    return {
      "select-dot__container": true,
      "select-dot__selected": this.selected
    }
  }

  get dotClasses() {
    return {
      "dot": this.selected
    }
  }
}