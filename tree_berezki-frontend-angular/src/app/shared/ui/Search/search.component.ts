import { Component, Input } from "@angular/core";
import { ReactiveFormsModule, FormsModule, FormControl } from "@angular/forms";
import { InputComponent } from "../Input/input.component";
import { InputValueSizeMobile, InputValueBackground } from "../Input/input.component";



@Component({
  imports: [
    InputComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  selector: "search-ui",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"]
})
export class SearchComponent {
  @Input() placeholder: string = "";
  @Input() background: InputValueBackground = "dark";
  @Input() width: string = "auto";
  @Input() size: InputValueSizeMobile = "medium_16";
  @Input() maxLength: number = 32;
  @Input() control: FormControl = new FormControl('');

  hasInput: boolean = false;

  get searchClasses() {
    return {
      "search": true,
      [this.background]: true,
      "search__focused": this.hasInput
    };
  }

  get svgFill() {
    return this.background === "dark" ? "var(--text)" : "var(--sub-text)";
  }

  onFocusEvent() {
    this.hasInput = true;
  }

  onBlurEvent() {
    this.hasInput = false;
  }
}