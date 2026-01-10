import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy, signal } from "@angular/core";

export type TImageType = "base" | "rounded";

@Component({
  selector: "image-ui",
  templateUrl: "./image.component.html",
  styleUrls: ["./image.component.css"]
})
export class ImageComponent implements AfterViewInit, OnDestroy {
  @Input() width: string = "auto";
  @Input() height: string = "auto";
  @Input() src: string = "";
  @Input() alt: string = "";
  @Input() maxHeight: string = "";
  @Input() type: TImageType = "rounded";
  
  @ViewChild("image", {static: false})
  imgRef!: ElementRef<HTMLImageElement>;

  isLoading = signal<boolean>(true);
  isError = signal<boolean>(false);

  ngAfterViewInit() {
    this.imgRef.nativeElement.onload = this.onImageLoad.bind(this);
    this.imgRef.nativeElement.onerror = this.onImageError.bind(this);
  }

  ngOnDestroy() {
    this.imgRef.nativeElement.onload = null;
    this.imgRef.nativeElement.onerror = null;
  }

  onImageLoad() {
    this.isLoading.set(false);
    this.isError.set(false);
  }

  onImageError() {
    this.isLoading.set(false);
    this.isError.set(true);
  }

  get imageClasses() {
    return {
      "img__container": true,
      [this.type]: true
    }
  }
}