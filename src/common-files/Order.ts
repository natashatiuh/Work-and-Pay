import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from './User';
import { Request } from './Request';
import { Review } from './Review';

@Entity({ name: 'orders' })
export class Order {
    @PrimaryColumn()
    id: string;

    @Column()
    orderName: string;

    @Column()
    authorId: string;

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

    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({ name: 'authorsId' })
    author: User

    @OneToMany(() => Request, (request) => request.order)
    requests: Request[]

    @OneToMany(() => Review, (review) => review.order)
    @JoinColumn({name: 'orderId'})
    reviews: Review[]
}
