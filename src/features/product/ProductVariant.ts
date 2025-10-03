import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Product } from "./Product.js";

@Entity({ name: "product_variants" })
@Index(["sku"], { unique: true })
@Index(["ean"], { unique: true })
class ProductVariant {
  @PrimaryGeneratedColumn({ name: "pva_id", type: "bigint" })
  id!: number;

  @Column({ name: "pva_uuid", type: "uuid", unique: true, default: () => "uuid_generate_v4()" })
  uuid!: string;

  @Column({ name: "pva_pro_id", type: "bigint" })
  productId!: number;

  @ManyToOne(() => Product, (product) => product.variants, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "pva_pro_id" })
  product!: Product;

  @Column({ name: "pva_sku", type: "varchar", length: 100, nullable: true, unique: true })
  sku!: string | null;

  @Column({ name: "pva_ean", type: "varchar", length: 13, nullable: true, unique: true })
  ean!: string | null;

  @Column({ name: "pva_price", type: "decimal", precision: 12, scale: 2 })
  price!: number;

  @Column({ name: "pva_stock_quantity", type: "int", default: 0 })
  stockQuantity!: number;

  @CreateDateColumn({ name: "pva_created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "pva_updated_at" })
  updatedAt!: Date;
}

export { ProductVariant };
