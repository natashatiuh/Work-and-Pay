import { Column, Entity } from 'typeorm';


@Entity()
export class Request {
    @Column()
    id: string;

    @Column()
    orderId: string;

    @Column()
    executorId: string;

    @Column()
    status: string;

    @Column()
    date: Date;
}
