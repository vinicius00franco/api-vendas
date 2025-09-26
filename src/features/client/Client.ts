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

export type ClientAddress = {
  street: string;
  number?: string;
  complement?: string;
  district?: string;
  city: string;
  region?: string;
  state?: string;
  postalCode: string;
  country: string;
};

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

  @Column({ nullable: true })
  phone!: string | null;

  @Column({ type: "jsonb" })
  address!: ClientAddress;

  @OneToMany(() => Sale, (sale: Sale) => sale.client)
  sales!: Sale[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

export { Client };
