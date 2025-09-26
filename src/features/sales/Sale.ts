import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Client } from "../client/Client.js";
import { Product } from "../product/Product.js";

@Entity({ name: "sales" })
class Sale {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column({ name: "uuid", type: "uuid", unique: true, default: () => "uuid_generate_v4()" })
  uuid!: string;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  value!: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  discount!: number;

  @Column({ name: "product_id" })
  productId!: number;

  // Temporary inverse side mapping adjusted; full refactor to Orders pending
  @ManyToOne(() => Product, (product) => product.variants, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @Column({ name: "client_id" })
  clientId!: number;

  @ManyToOne(() => Client, (client) => client.sales, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "client_id" })
  client!: Client;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

export { Sale };
