import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule, FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder} from "@angular/forms";

import { InputShelfComponent } from "../../ui/InputShelf/input-shelf.component";
import { TextComponent } from "../../ui/Text/text.component";
import { ButtonComponent } from "../../ui/Button/button.component";
import { InputFocusDirective } from "../../directives/input-focus.directive";

@Component({
  selector: "form-email-layout",
  templateUrl: "./form-email.component.html",
  styleUrls: ["./form-email.component.css"],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputShelfComponent,
    TextComponent,
    ButtonComponent,
    InputFocusDirective
  ]
})
export class FormEmailComponent {
  @Output() onSubmit = new EventEmitter<{email: string}>();
  @Input() serverError: string = "";

  emailForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.emailForm = this.formBuilder.group({
      "email": ["", [Validators.required, Validators.email]],
    });
  }

  isPlaceholderOnEmail = false;

  onFocusEventName() {
    this.isPlaceholderOnEmail = true;
  }

  onEmptyEventName() {
    this.isPlaceholderOnEmail = false;
  }

  onBlurEventName() {
    if (this.emailControl.value === "") {
      this.isPlaceholderOnEmail = false;
    }
  }
  

  submit() {
    if (this.emailForm.valid) {
      this.onSubmit.emit(this.emailForm.value);
    }
  }

  get isInvalidEmail() {
    return this.emailForm.controls['email'].invalid && this.emailForm.controls['email'].touched;
  }

  get isDisabled() {
    return this.emailForm.invalid;
  }

  get emailControl(): FormControl {
    return this.emailForm.controls['email'] as FormControl;
  }
}
