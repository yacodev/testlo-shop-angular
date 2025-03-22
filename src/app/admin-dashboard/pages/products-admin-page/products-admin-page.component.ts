import { Component, inject, signal } from '@angular/core';
import { ProductTableComponent } from '../../../products/components/product-table/product-table.component';
import { ProductsService } from '@/products/services/products.services';
import { PaginationService } from '@/shared/components/pagination/pagination.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {
  productsServices = inject(ProductsService);
  paginationService = inject(PaginationService);
  productPerPage = signal(10);

  productsResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.productPerPage(),
    }),
    loader: ({ request }) => {
      return this.productsServices.getProducts({
        offset: request.page * 9,
        limit: request.limit,
      });
    },
  });
}
