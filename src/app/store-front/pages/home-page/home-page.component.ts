import { ProductCardComponent } from '@/products/components/product-card/product-card.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {}
