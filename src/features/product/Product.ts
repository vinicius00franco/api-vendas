import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "../category/Category.js";
import { Sale } from "../sales/Sale.js";

@Entity({ name: "products" })
@Index(["name"], { unique: true })
class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ name: "ean", length: 20, unique: true })
  ean!: string;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  price!: number;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ name: "category_id" })
  categoryId!: number;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "category_id" })
  category!: Category;

  @OneToMany(() => Sale, (sale: Sale) => sale.product)
  sales!: Sale[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

export { Product };
