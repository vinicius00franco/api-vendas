import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Sale } from "../sales/Sale.js";

@Entity({ name: "clients" })
@Index(["document"], { unique: true })
class Client {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column({ name: "uuid", type: "uuid", unique: true, default: () => "uuid_generate_v4()" })
  uuid!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  document!: string;

  @Column()
  email!: string;

  @Column()
  address!: string;

  @Column({ name: "zip_code" })
  zipCode!: string;

  @Column()
  number!: string;

  @Column()
  city!: string;

  @Column({ length: 2 })
  state!: string;

  @OneToMany(() => Sale, (sale: Sale) => sale.client)
  sales!: Sale[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

export { Client };
