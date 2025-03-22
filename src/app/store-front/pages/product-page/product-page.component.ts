import { ProductCarouselComponent } from '@/products/components/product-carousel/product-carousel.component';
import { ProductsService } from '@/products/services/products.services';
import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent, JsonPipe],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {
  activateRoute = inject(ActivatedRoute);
  productService = inject(ProductsService);

  productIdSlug = this.activateRoute.snapshot.params['idSlug'];

  productResource = rxResource({
    request: () => ({ idSlug: this.productIdSlug }),
    loader: ({ request }) =>
      this.productService.getProductBySlug(request.idSlug),
  });
}
