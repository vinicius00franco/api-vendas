import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
// use string-based relations to avoid ESM circular init issues in tests

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

  @Column({ name: "product_id", type: "bigint" })
  productId!: number;

  // Temporary inverse side mapping adjusted; full refactor to Orders pending
  @ManyToOne("Product", (product: any) => product.variants, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product!: any;

  @Column({ name: "client_id", type: "bigint" })
  clientId!: number;

  @ManyToOne("Client", (client: any) => client.sales, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "client_id" })
  client!: any;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

export { Sale };
