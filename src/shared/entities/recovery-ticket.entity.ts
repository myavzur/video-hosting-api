import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { ChannelEntityLimits } from "../constants/database.constants";

@Entity({ name: "recovery_tickets" })
export class RecoveryTicket extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("varchar", { length: 255, unique: true })
	hash: string;

	@Column("varchar", { length: ChannelEntityLimits.EMAIL_LEN })
	email: string;

	@Column("bigint", { nullable: false })
	expiresAt: number;
}
