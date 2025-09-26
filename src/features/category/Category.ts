import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Product } from "../product/Product.js";

@Entity({ name: "categories" })
class Category {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column({ name: "uuid", type: "uuid", unique: true, default: () => "uuid_generate_v4()" })
  uuid!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  description!: string | null;

  @OneToMany(() => Product, (product: Product) => product.category)
  products!: Product[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

export { Category };
