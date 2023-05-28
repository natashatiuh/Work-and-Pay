import { Column, Entity } from 'typeorm';


@Entity()
export class User {
    @Column()
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
}
