import { Component, Input } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: "menu-mobile-ui",
  templateUrl: "./menu-mobile.component.html",
  styleUrls: ["./menu-mobile.component.css"]
})
export class MenuMobileComponent {
  @Input() mainUrl: string = "/";
  @Input() categoriesUrl: string = "/categories";
  @Input() basketUrl: string = "/basket";
  @Input() accountUrl: string = "/account";
}