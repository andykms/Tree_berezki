import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { ShopService } from '../../core/services/shop.service';
import { IShowcase } from '../../core/models/showcase.model';
import { IBaseResponse } from '../../core/models/base-response.model';


@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  shopId = toSignal<string>(this.route.paramMap.pipe(map(params => params.get('shopId') || '')));
  showcases: IShowcase[] = [];
  loading = signal<boolean>(false);
  error = signal<string|null>(null);
  
  private routeSub: Subscription = new Subscription();

  constructor(
    private router: Router,
    private shopService: ShopService
  ) {}

  ngOnInit(): void {
    this.loadShowcases();
  }

  async loadShowcases(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    
    this.shopService.getShowcaseList(this.shopId()!)
      .subscribe({
        next: (response: IBaseResponse<IShowcase>) => {
          this.showcases = response.items || [];
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Не удалось загрузить группы товаров');
          this.loading.set(false);
        }
      });
  }

  getRatingStars(rating: number): number[] {
    const fullStars = Math.floor(rating);
    return Array(fullStars).fill(1);
  }

  getRatingColor(rating: number): string {
    if (rating >= 4) return '#00ff00';
    if (rating >= 3) return '#ffd700';
    return '#ff4444';
  }

  onCreateShowcase(): void {
    this.router.navigate(['showcase','create'], {
      queryParams: { shopId: this.shopId() }
    });
  }

  onShowcaseClick(showcaseId: string): void {
    this.router.navigate(['/showcase', showcaseId], {
      queryParams: { shopId: this.shopId() }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}