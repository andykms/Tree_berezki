import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ButtonComponent } from "../Button/button.component";
import { TextComponent } from "../Text/text.component";


@Component({
  imports: [ButtonComponent, TextComponent],
  selector: "dropdown-ui",
  templateUrl: "./dropdown.component.html",
  styleUrls: ["./dropdown.component.css"]
})
export class DropdownComponent {
  @Input() options: string[] = [];
  @Input() isOpened = false;
  @Output() onClick = new EventEmitter<number>();

  onSelect(index: number) {
    this.onClick.emit(index);
  }
}