import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ButtonComponent, ButtonType } from "../Button/button.component";
import { TextComponent, TextBackground } from "../Text/text.component";


@Component({
  imports: [ButtonComponent, TextComponent],
  selector: "select-dropdown-ui",
  templateUrl: "./select-dropdown.component.html",
  styleUrls: ["./select-dropdown.component.css"]
})
export class SelectDropdownComponent {
  @Input() options: string[] = [];
  @Input() selectedIndex: number = 0;
  @Output() onChange = new EventEmitter<number>();

  isOpened: boolean = false;

  onSelect(index: number) {
    this.isOpened = false;
    this.onChange.emit(index);
  }

  toggle() {
    this.isOpened = !this.isOpened;
  }

  get selectedOption() {
    return this.options[this.selectedIndex];
  }

  get buttonType(): ButtonType {
    return this.isOpened ? "primary" : "tertiary";
  }

  get textBack(): TextBackground {
    return this.isOpened ? "light" : "dark";
  }

  get svgFill(): string {
    return this.isOpened ? "var(--on-light-text)" : "var(--text)";
  }

  textOptionBold(index: number): boolean {
    return index === this.selectedIndex ? true : false;
  }

  textOptionBack(index: number): TextBackground {
    return index === this.selectedIndex ? "light" : "dark";
  }

  optionButtonClass(index: number) {
    return {
      "select-dropdown__option-button": true,
      "select-dropdown__option-button--selected": this.selectedIndex === index
    };
  }
}