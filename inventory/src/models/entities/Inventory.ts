import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'inventory' })
export class Inventory {
  @PrimaryGeneratedColumn('increment')
  id: number | any;

  @Column({ type: 'varchar', length: 255, unique: true })
  sku: string | any;

  @Column({ type: 'int' })
  quantity: number | any;

  constructor(sku: string, quantity: number) {
    this.sku = sku;
    this.quantity = quantity;
  }
}
