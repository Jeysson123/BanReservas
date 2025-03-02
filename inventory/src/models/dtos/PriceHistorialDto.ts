export class PriceHistorialDto {
    sku: string | any;
    name: string | any;
    price: number | any;
    newPrice: number | any;
    updateAt: Date | any;

    constructor(sku: string, name: string, price: number, newPrice: number, updateAt: Date) {
      this.sku = sku;
      this.name = name;
      this.price = price;
      this.newPrice = newPrice;
      this.updateAt = updateAt;
    }
  }
  