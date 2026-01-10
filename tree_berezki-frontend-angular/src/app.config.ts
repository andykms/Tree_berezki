import { ApplicationConfig } from "@angular/core";
import { provideRouter, Routes } from "@angular/router";


const appRoutes: Routes =[
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(appRoutes)]
};