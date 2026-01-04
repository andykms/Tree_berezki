import { Component, Input } from "@angular/core";

export type BodyType = "primary" | "secondary" | "tertiary";

@Component({
  selector: "body-ui",
  templateUrl: "./body.component.html",
  styleUrls: ["./body.component.css"]
})
export class BodyComponent {
  @Input() type: BodyType = "primary";
  @Input() width = "auto";
  @Input() height = "auto";

  get bodyClasses() {
    return {
      "body": true,
      [this.type]: true
    };
  }
}
