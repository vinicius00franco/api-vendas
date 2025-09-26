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
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  value!: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  discount!: number;

  @Column({ name: "product_id" })
  productId!: number;

  @ManyToOne(() => Product, (product) => product.sales, {
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
