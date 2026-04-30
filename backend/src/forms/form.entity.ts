import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "../users/user.entity";

export type FormType = "succession" | "naturalisation" | "maprimereno";
export type FormStatus = "draft" | "paid" | "generated";

@Entity("forms")
export class Form {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  type: FormType;

  @Column({ default: "draft" })
  status: FormStatus;

  @Column({ type: "jsonb" })
  data: Record<string, unknown>;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
