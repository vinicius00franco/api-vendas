import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Product } from "../product/Product.js";

@Entity({ name: "categories" })
class Category {
  @PrimaryGeneratedColumn({ name: "cat_id", type: "bigint" })
  id!: number;

  @Column({ name: "cat_uuid", type: "uuid", unique: true, default: () => "uuid_generate_v4()" })
  uuid!: string;

  @Column({ name: "cat_name", unique: true })
  name!: string;

  @Column({ name: "cat_description", nullable: true })
  description!: string | null;

  @Column({ name: "cat_parent_id", type: "bigint", nullable: true })
  parentId!: number | null;

  @ManyToOne(() => Category, (category) => category.children, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "cat_parent_id" })
  parent!: Category | null;

  @OneToMany(() => Category, (category) => category.parent)
  children!: Category[];

  @OneToMany(() => Product, (product: Product) => product.category)
  products!: Product[];

  @CreateDateColumn({ name: "cat_created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "cat_updated_at" })
  updatedAt!: Date;
}

export { Category };
