import { Component, Input, Output, EventEmitter } from "@angular/core";

import { DropdownComponent } from "../Dropdown/dropdown.component";
import { ButtonComponent } from "../Button/button.component";

@Component({
  selector: "menu-dropdown-ui",
  templateUrl: "./menu-dropdown.component.html",
  styleUrls: ["./menu-dropdown.component.css"],
  imports: [
    DropdownComponent,
    ButtonComponent
  ]
})
export class MenuDropdownComponent {
  @Input() options: string[] = [];
  @Output() onClick = new EventEmitter<number>();

  isOpened: boolean = false;

  onClickOption(index: number) {
    this.onClick.emit(
      index
    );
    this.isOpened = false;
  }

  toggle() {
    this.isOpened = !this.isOpened;
  }
}