import { Component, Input, Output } from "@angular/core";  

import { AdvertInfoComponent, TAdvertInfo } from "../AdvertInfo/advert-info.component";
import { ImageComponent } from "../Image/image.component";


@Component({
  selector: "advert-banner-ui",
  templateUrl: "./advert-banner.component.html",
  styleUrls: ["./advert-banner.component.css"],
  imports: [
    AdvertInfoComponent,
    ImageComponent
  ]
})
export class AdvertBannerComponent {
  @Input() advert: TAdvertInfo = {
    INN: "",
    organization: ""
  };
  @Input() src: string = "";
  @Input() link: string = "";
  @Input() width: string = "auto";
  @Input() height: string = "auto";
}
