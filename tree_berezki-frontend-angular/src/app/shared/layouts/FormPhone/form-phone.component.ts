import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule, FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder} from "@angular/forms";

import { InputShelfComponent } from "../../ui/InputShelf/input-shelf.component";
import { TextComponent } from "../../ui/Text/text.component";
import { ButtonComponent } from "../../ui/Button/button.component";
import { InputFocusDirective } from "../../directives/input-focus.directive";

@Component({
  selector: "form-phone-layout",
  templateUrl: "./form-phone.component.html",
  styleUrls: ["./form-phone.component.css"],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputShelfComponent,
    TextComponent,
    ButtonComponent,
    InputFocusDirective
  ]
})
export class FormPhoneComponent {
  @Output() onSubmit = new EventEmitter<{phone: string}>();
  @Input() serverError: string = "";

  phoneForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.phoneForm = this.formBuilder.group({
      "phone": ["", [Validators.required, Validators.minLength(12)]],
    });
  }

  isPlaceholderOnPhone = false;

  onFocusEventPhone() {
    this.isPlaceholderOnPhone = true;
  }

  onEmptyEventPhone() {
    this.isPlaceholderOnPhone = false;
  }

  onBlurEventPhone() {
    if (this.phoneControl.value === "") {
      this.isPlaceholderOnPhone = false;
    }
  }
  

  submit() {
    if (this.phoneForm.valid) {
      this.onSubmit.emit(this.phoneForm.value);
    }
  }

  get isInvalidPhone() {
    return this.phoneForm.controls['phone'].invalid && this.phoneForm.controls['phone'].touched;
  }

  get isDisabled() {
    return this.phoneForm.invalid;
  }

  get phoneControl(): FormControl {
    return this.phoneForm.controls['phone'] as FormControl;
  }
}
