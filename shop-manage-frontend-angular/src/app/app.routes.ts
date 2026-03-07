import { Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
 {
    path: 'login',
    loadComponent: () => import("./pages/Auth/auth.component").then(m => m.AuthComponent)
  }, 
  {
    path: 'register',
    loadComponent: () => import("./pages/Register/register.component").then(m => m.RegisterComponent)
  },
  {
    path: 'user',
    loadComponent: () => import("./pages/User/user.component").then(m => m.UserComponent),
    canActivate: [AuthGuard]
  },
  {
    path: "create-shop",
    loadComponent: () => import("./pages/CreateShop/create-shop.component").then(m => m.CreateShopComponent),
    canActivate: [AuthGuard]
  },
  {
    path: "shop/:shopId",
    loadComponent: () => import("./pages/Shop/shop.component").then(m => m.ShopComponent),
    canActivate: [AuthGuard]
  },
  {
    path: "showcase/create",
    loadComponent: () => import("./pages/CreateGroup/create-showcase.component").then(m => m.CreateShowcaseComponent),
    canActivate: [AuthGuard]
  },
];
