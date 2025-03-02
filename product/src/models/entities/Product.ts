import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('increment')
  id: number | any;

  @Column({ type: 'varchar', length: 255 })
  name: string | any;

  @Column({ type: 'varchar', length: 255 })
  description: string | any;

  @Column({ type: 'varchar', length: 255 })
  price: string | any;

  
  @Column({ type: 'varchar', length: 255 })
  category: string | any;

  
  @Column({ type: 'varchar', length: 255, unique: true })
  sku: string | any;

}
