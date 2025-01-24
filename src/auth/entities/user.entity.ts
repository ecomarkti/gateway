import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Rol } from './rol.entity';

@Entity('users')
export class User {

  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column('text', { name: 'FIRST_NAME' })
  firstName: string;

  @Column('text', { name: 'LAST_NAME' })
  lastName: string;

  @Column('text', { unique: true, name: 'NICKNAME' })
  nickname: string;

  @Column('text', { unique: true, name: 'EMAIL' })
  email: string;

  @Column('text', { name: 'PASSWORD' })
  password: string;

  @Column('text', { name: 'PHONE' })
  phone: string;

  @Column('text', { name: 'ADDRESS' })
  address: string;

  @Column('text', { name: 'CITY' })
  city: string;

  @Column('bool', { default: true, name: 'IS_ACTIVE' })
  is_active: boolean;

  @Column('bool', { default: false, name: 'IS_ADMIN' })
  is_admin: boolean;

  @Column('text', { name: 'AVATAR_URL' })
  avatar_url: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'CREATE_AT' })
  create_at: Date;

  @ManyToOne(() => Rol, rol => rol.users)
  @JoinColumn({ name: 'ROL_ID' })
  rol: Rol;
}
