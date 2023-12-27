import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class Base {
	@PrimaryGeneratedColumn()
	readonly id: number;

	@CreateDateColumn()
	readonly created_at: Date;

	@UpdateDateColumn()
	readonly updated_at: Date;
}
