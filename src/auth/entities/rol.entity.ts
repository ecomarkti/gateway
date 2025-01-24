import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';


@Entity()
export class Rol {

  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column('text', { name: 'NAME' })
  name: string;

  @Column('text', { name: 'DESCRIPTION' })
  description: string;

  @OneToMany(() => User, user => user.rol)
  users: User[]
}
