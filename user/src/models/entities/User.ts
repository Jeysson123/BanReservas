import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number | any;

  @Column({ type: 'varchar', length: 255, unique: true })
  username: string | any;

  @Column({ type: 'varchar', length: 255 })
  password: string | any;

  @Column({ type: 'varchar', length: 255 })
  role: string | any;

}
