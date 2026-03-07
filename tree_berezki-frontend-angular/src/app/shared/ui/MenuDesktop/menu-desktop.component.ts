import { Component, Input, Output, EventEmitter } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

import { SearchComponent } from "../Search/search.component";
import { TextComponent } from "../Text/text.component";

@Component({
  selector: "menu-desktop-ui",
  templateUrl: "./menu-desktop.component.html",
  styleUrls: ["./menu-desktop.component.css"],
  imports: [
    SearchComponent,
    RouterLink,
    RouterLinkActive,
    TextComponent
  ]
})
export class MenuDesktopComponent {
  @Input() mainUrl: string = "/";
  @Input() categoriesUrl: string = "/categories";
  @Input() basketUrl: string = "/basket";
  @Input() accountUrl: string = "/account";
  @Input() isAuth: boolean = false;

  @Output() search = new EventEmitter<string>();

  get textAccount() {
    return this.isAuth ? "Профиль" : "Войти";
  }
}