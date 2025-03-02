export class InventoryUpdateDto {
    sku: string | any;
    quantity: number | any;
    incrementing: boolean | any;

    constructor(sku: string, quantity: number, incrementing: boolean){
      this.sku = sku;
      this.quantity = quantity;
      this.incrementing = incrementing;
    }
  }
  