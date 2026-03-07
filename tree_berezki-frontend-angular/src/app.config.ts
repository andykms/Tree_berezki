import { ApplicationConfig } from "@angular/core";
import { provideRouter, Routes } from "@angular/router";
import { provideZoneChangeDetection } from "@angular/core";

const appRoutes: Routes =[
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(appRoutes)],
};