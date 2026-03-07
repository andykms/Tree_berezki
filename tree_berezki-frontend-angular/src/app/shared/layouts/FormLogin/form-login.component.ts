import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule, FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder} from "@angular/forms";

import { InputShelfComponent } from "../../ui/InputShelf/input-shelf.component";
import { TextComponent } from "../../ui/Text/text.component";
import { ButtonComponent } from "../../ui/Button/button.component";
import { InputFocusDirective } from "../../directives/input-focus.directive";

@Component({
  selector: "form-login-layout",
  templateUrl: "./form-login.component.html",
  styleUrls: ["./form-login.component.css"],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputShelfComponent,
    TextComponent,
    ButtonComponent,
    InputFocusDirective
  ]
})
export class FormLoginComponent {
  @Output() onSubmit = new EventEmitter<{phone: string; password: string}>();
  @Input() serverError: string = "";

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      "phone": ["+7", [Validators.required, Validators.minLength(12), Validators.pattern(/\+7[0-9]/)]],
      "password": ["", [Validators.required, Validators.minLength(1)]]
    });
  }

  isPlaceholderOnPhone = false;
  isPlaceholderOnPassword = false;

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

  onFocusEventPassword() {
    this.isPlaceholderOnPassword = true;
  }

  onEmptyEventPassword() {
    this.isPlaceholderOnPassword = false;
  }

  onBlurEventPassword() {
    if (this.passwordControl.value === "") {
      this.isPlaceholderOnPassword = false;
    }
  }
  

  submit() {
    if (this.loginForm.valid) {
      this.onSubmit.emit(this.loginForm.value);
    }
  }

  get isInvalidPhone() {
    return this.loginForm.controls['phone'].invalid && this.loginForm.controls['phone'].touched;
  }

  get isInvalidPassword() {
    return this.loginForm.controls['password'].invalid && this.loginForm.controls['password'].touched;
  }

  get isDisabled() {
    return this.loginForm.invalid;
  }

  get phoneControl(): FormControl {
    return this.loginForm.controls['phone'] as FormControl;
  }

  get passwordControl(): FormControl {
    return this.loginForm.controls['password'] as FormControl;
  }
}
