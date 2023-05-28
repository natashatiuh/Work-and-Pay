import { Column, Entity } from 'typeorm';

@Entity()
export class Order {
    @Column()
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
