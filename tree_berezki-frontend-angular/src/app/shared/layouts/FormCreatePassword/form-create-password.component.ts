import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule, FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder} from "@angular/forms";

import { InputShelfComponent } from "../../ui/InputShelf/input-shelf.component";
import { TextComponent } from "../../ui/Text/text.component";
import { ButtonComponent } from "../../ui/Button/button.component";
import { InputFocusDirective } from "../../directives/input-focus.directive";
import { SelectDotComponent } from "../../ui/SelectDot/select-dot.component";

@Component({
  selector: "form-create-password-layout",
  templateUrl: "./form-create-password.component.html",
  styleUrls: ["./form-create-password.component.css"],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputShelfComponent,
    TextComponent,
    ButtonComponent,
    SelectDotComponent,
    InputFocusDirective
  ]
})
export class FormCreatePasswordComponent {
  @Output() onSubmit = new EventEmitter<{password: string}>();
  @Input() serverError: string = "";

  passwordForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.passwordForm = this.formBuilder.group({
      "password": ["", [Validators.required, Validators.minLength(8)]],
      "repeatPassword": ["", [Validators.required, Validators.minLength(8), this.repeatPasswordValidator.bind(this)]]
    });
  }

  repeatPasswordValidator(control: FormControl): {[s:string]:boolean}|null{     
    if(control.value !== this.passwordForm?.controls['password'].value){
      return {"repeatPassword": true};
    }
    return null;
  }

  isSelectedPersonalDataProcessing = false;

  onSelectPersonalDataProcessing() {
    this.isSelectedPersonalDataProcessing = !this.isSelectedPersonalDataProcessing;
  }

  isPlaceholderOnPassword = false;
  isPlaceholderOnRepeatPassword = false;

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

  onFocusEventRepeatPassword() {
    this.isPlaceholderOnRepeatPassword = true;
  }

  onEmptyEventRepeatPassword() {
    this.isPlaceholderOnRepeatPassword = false;
  }

  onBlurEventRepeatPassword() {
    if (this.repeatPasswordControl.value === "") {
      this.isPlaceholderOnRepeatPassword = false;
    }
  }
  

  submit() {
    if (this.passwordForm.valid && this.isSelectedPersonalDataProcessing) {
      this.onSubmit.emit(this.passwordForm.value);
    }
  }

  get isInvalidPassword() {
    return this.passwordForm.controls['password'].invalid && this.passwordForm.controls['password'].touched;
  }

  get isInvalidRepeatPassword() {
    return this.passwordForm.controls['repeatPassword'].invalid && this.passwordForm.controls['repeatPassword'].touched;
  }

  get isDisabled() {
    return this.passwordForm.invalid || !this.isSelectedPersonalDataProcessing;
  }

  get passwordControl(): FormControl {
    return this.passwordForm.controls['password'] as FormControl;
  }

  get repeatPasswordControl(): FormControl {
    return this.passwordForm.controls['repeatPassword'] as FormControl;
  }
}
