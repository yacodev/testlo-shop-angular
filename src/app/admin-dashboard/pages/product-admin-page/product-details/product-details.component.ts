import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ProductCarouselComponent } from '../../../../products/components/product-carousel/product-carousel.component';
import { Product } from '@/products/interfaces/product.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@/utils/form-utils';
import { FormErrorLabelComponent } from '@/shared/components/form-error-label/form-error-label.component';
import { ProductsService } from '@/products/services/products.services';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-details',
  imports: [
    ProductCarouselComponent,
    ReactiveFormsModule,
    FormErrorLabelComponent,
  ],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  product = input.required<Product>();
  fb = inject(FormBuilder);
  productService = inject(ProductsService);
  router = inject(Router);
  wasSaved = signal(false);

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: [
      '',
      [Validators.required, Validators.pattern(FormUtils.slugPattern)],
    ],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: [
      'men',
      [Validators.required, Validators.pattern(/men|women|kid|unisex/)],
    ],
  });

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.patchValue(formLike as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',') });
  }

  onSizeClicked(size: string) {
    const currentSizes = this.productForm.value.sizes ?? [];
    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes });
  }

  async onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();
    if (!isValid) return;
    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags?.split(',').map((tag: string) => tag.trim()),
    };

    if (this.product().id === 'new') {
      const product = await firstValueFrom(
        this.productService.createProduct(productLike)
      );

      this.router.navigate(['/admin/products', product.id]);
      return;
    } else {
      await firstValueFrom(
        this.productService.updateProduct(this.product().id, productLike)
      );
    }
    this.wasSaved.set(true);
    setTimeout(() => this.wasSaved.set(false), 3000);
  }
}
