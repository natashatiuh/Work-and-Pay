import { Column, Entity, PrimaryColumn } from 'typeorm';


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
}
