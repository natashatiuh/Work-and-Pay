import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'orders' })
export class Order {
    @PrimaryColumn()
    id: string;

    @Column()
    orderName: string;

    @Column()
    authorsId: string;

    @Column({ nullable: true })
    dateOfPublishing: Date | null;

    @Column()
    country: string;

    @Column()
    city: string;

    @Column()
    price: number;

    @Column()
    state: string;
}
