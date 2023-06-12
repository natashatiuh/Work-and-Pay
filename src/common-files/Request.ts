import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Order } from './Order';


@Entity({ name: 'requests' })
export class Request {
    @PrimaryColumn()
    id: string;

    @Column()
    orderId: string;

    @Column()
    executorId: string;

    @Column()
    status: string;

    @Column()
    date: Date;

    @ManyToOne(() => Order, (order) => order.requests)
    @JoinColumn({ name: "orderId" })
    order: Order
}
