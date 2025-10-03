import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Product } from "../product/Product.js";

@Entity({ name: "brands" })
class Brand {
  @PrimaryGeneratedColumn({ name: "brd_id", type: "bigint" })
  id!: number;

  @Column({ name: "brd_uuid", type: "uuid", unique: true, default: () => "uuid_generate_v4()" })
  uuid!: string;

  @Column({ name: "brd_name", type: "varchar", unique: true })
  name!: string;

  @OneToMany(() => Product, (product: Product) => product.brand)
  products!: Product[];

  @CreateDateColumn({ name: "brd_created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "brd_updated_at" })
  updatedAt!: Date;
}

export { Brand };
