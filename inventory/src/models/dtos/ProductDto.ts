export class ProductDto {
    sku: string | any;
    name: string | any;
    price: number | any;

    constructor(sku: string, name: string, price: number) {
      this.sku = sku;
      this.name = name;
      this.price = price;
    }
  }
  