import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "users" })
@Index(["email"], { unique: true })
class User {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column({ name: "uuid", type: "uuid", unique: true, default: () => "uuid_generate_v4()" })
  uuid!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ unique: true, type: "varchar" })
  email!: string;

  @Column({ name: "password_hash", select: false, type: "varchar" })
  passwordHash!: string;

  @Column({ name: "is_admin", default: false, type: "boolean" })
  isAdmin!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

export { User };
