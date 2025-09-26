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
import { Brand } from "../brand/Brand.js";
import { ProductVariant } from "./ProductVariant.js";

@Entity({ name: "products" })
@Index(["name"], { unique: true })
class Product {
  @PrimaryGeneratedColumn({ name: "pro_id", type: "bigint" })
  id!: number;

  @Column({ name: "pro_uuid", type: "uuid", unique: true, default: () => "uuid_generate_v4()" })
  uuid!: string;

  @Column({ name: "pro_name" })
  name!: string;

  @Column({ name: "pro_description", type: "text", nullable: true })
  description!: string | null;

  @Column({ name: "pro_cat_id" })
  categoryId!: number;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "pro_cat_id" })
  category!: Category;

  @Column({ name: "pro_brd_id" })
  brandId!: number;

  @ManyToOne(() => Brand, (brand) => brand.products, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "pro_brd_id" })
  brand!: Brand;

  @OneToMany(() => ProductVariant, (variant: ProductVariant) => variant.product)
  variants!: ProductVariant[];

  @CreateDateColumn({ name: "pro_created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "pro_updated_at" })
  updatedAt!: Date;
}

export { Product };
