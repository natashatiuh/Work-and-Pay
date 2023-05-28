import { Column, Entity, PrimaryColumn } from 'typeorm';


@Entity({ name: 'reviews' })
export class Review {
    @PrimaryColumn()
    id: string;

    @Column()
    orderId: string;

    @Column()
    recipientId: string;

    @Column({ nullable: true })
    mark: number | null;

    @Column({ nullable: true })
    comment: string | null;

    @Column()
    date: Date;
}
