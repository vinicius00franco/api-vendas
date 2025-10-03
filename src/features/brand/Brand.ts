import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
// relation target referenced by string to avoid circular init during tests

@Entity({ name: "brands" })
class Brand {
  @PrimaryGeneratedColumn({ name: "brd_id", type: "bigint" })
  id!: number;

  @Column({ name: "brd_uuid", type: "uuid", unique: true, default: () => "uuid_generate_v4()" })
  uuid!: string;

  @Column({ name: "brd_name", type: "varchar", unique: true })
  name!: string;

  @OneToMany("Product", (product: any) => product.brand)
  products!: any[];

  @CreateDateColumn({ name: "brd_created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "brd_updated_at" })
  updatedAt!: Date;
}

export { Brand };
