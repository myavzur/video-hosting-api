import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class Base {
	@PrimaryGeneratedColumn()
	readonly id: number;

	@CreateDateColumn()
	readonly createdAt: Date;

	@UpdateDateColumn()
	readonly updatedAt: Date;
}
