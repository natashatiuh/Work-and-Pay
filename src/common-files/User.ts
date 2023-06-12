import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Order } from './Order';


@Entity({ name: 'users' })
export class User {
    @PrimaryColumn()
    id: string;

    @Column()
    userName: string;

    @Column()
    age: number;

    @Column()
    country: string;

    @Column()
    city: string;

    @Column()
    password: string;

    @OneToMany(() => Order, (order) => order.author)
    orders: Order[]
}
