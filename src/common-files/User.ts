import { Column, Entity, PrimaryColumn } from 'typeorm';


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
}
