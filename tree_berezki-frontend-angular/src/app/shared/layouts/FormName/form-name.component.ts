import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule, FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder} from "@angular/forms";

import { InputShelfComponent } from "../../ui/InputShelf/input-shelf.component";
import { TextComponent } from "../../ui/Text/text.component";
import { ButtonComponent } from "../../ui/Button/button.component";
import { InputFocusDirective } from "../../directives/input-focus.directive";

@Component({
  selector: "form-name-layout",
  templateUrl: "./form-name.component.html",
  styleUrls: ["./form-name.component.css"],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputShelfComponent,
    TextComponent,
    ButtonComponent,
    InputFocusDirective
  ]
})
export class FormNameComponent {
  @Output() onSubmit = new EventEmitter<{name: string}>();
  @Input() serverError: string = "";

  nameForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.nameForm = this.formBuilder.group({
      "name": ["", [Validators.required, Validators.minLength(3)]],
    });
  }

  isPlaceholderOnName = false;

  onFocusEventName() {
    this.isPlaceholderOnName = true;
  }

  onEmptyEventName() {
    this.isPlaceholderOnName = false;
  }

  onBlurEventName() {
    if (this.nameControl.value === "") {
      this.isPlaceholderOnName = false;
    }
  }
  

  submit() {
    if (this.nameForm.valid) {
      this.onSubmit.emit(this.nameForm.value);
    }
  }

  get isInvalidName() {
    return this.nameForm.controls['name'].invalid && this.nameForm.controls['name'].touched;
  }

  get isDisabled() {
    return this.nameForm.invalid;
  }

  get nameControl(): FormControl {
    return this.nameForm.controls['name'] as FormControl;
  }
}
