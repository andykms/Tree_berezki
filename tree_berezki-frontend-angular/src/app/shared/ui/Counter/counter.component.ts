import { Component, Input } from "@angular/core";
import { TextComponent } from "../Text/text.component";

export type CounterType = "small" | "large";

@Component({
  imports: [TextComponent],
  selector: "counter-ui",
  templateUrl: "./counter.component.html",
  styleUrls: ["./counter.component.css"]
})
export class CounterComponent {
  @Input() count = 0;
  @Input() type: CounterType = "small";

  get counterClasses() {
    return {
      counter: true,
      [this.type]: true
    };
  }
}