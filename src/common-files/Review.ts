import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn } from 'typeorm';
import { Order } from "../common-files/Order"


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

    @ManyToOne(() => Order, (order)=> order.reviews)
    order: Order
}
