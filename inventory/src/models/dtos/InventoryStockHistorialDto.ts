export class InventoryStockHistorialDto {
    sku: string | any;
    quantity: number | any;
    newQuantity: number | any;
    updatedAt: Date | any;

    constructor(sku: string, quantity: number, newQuantity: number, updateAt: Date) {
      this.sku = sku;
      this.quantity = quantity;
      this.newQuantity = newQuantity;
      this.updatedAt = updateAt;
    }
  }
  