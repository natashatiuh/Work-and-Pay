import { Column, Entity } from 'typeorm';


@Entity()
export class Review {
    @Column()
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
