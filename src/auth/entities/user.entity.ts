import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Rol } from './rol.entity';

@Entity('users')
export class User {

  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @ManyToOne(() => Rol, rol => rol.users)
  @JoinColumn({ name: 'ROL_ID' })
  rol?: Rol;

  @Column('text', { name: 'FIRST_NAME' })
  firstname: string;

  @Column('text', { name: 'LAST_NAME' })
  lastname: string;

  @Column('text', { unique: true, name: 'NICKNAME' })
  nickname: string;

  @Column('text', { unique: true, name: 'EMAIL' })
  email: string;

  @Column('text', { name: 'PASSWORD', select: false }) // select: false para que no se muestre en las consultas.
  password: string;

  @Column('text', { name: 'REFRESH_TOKEN', nullable: true })
  refreshToken: string;

  @Column('text', { name: 'PHONE' })
  phone: string;

  @Column('text', { name: 'ADDRESS', nullable: true })
  address?: string;

  @Column('text', { name: 'CITY', nullable: true })
  city?: string;

  @Column('bool', { default: false, name: 'IS_ACTIVE' })
  isActive?: boolean;

  @Column('bool', { default: false, name: 'IS_ADMIN' })
  isAdmin?: boolean;

  @Column('text', { name: 'AVATAR_URL', nullable: true })
  avatarUrl?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'CREATE_AT' })
  createAt?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'UPDATE_AT' })
  updateAt?: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'DELETE_AT' })
  deleteAt?: Date;

  @BeforeInsert()
  async setDefaultRol() {
    this.rol = new Rol();
    this.rol.id = 3; // rol usuario.
  }

  @BeforeInsert()
  async setDefaultData() {
    this.firstname = this.firstname.toLowerCase().trim();
    this.lastname = this.lastname.toLowerCase().trim();
    this.nickname = this.nickname.toLowerCase().trim();
    this.email = this.email.toLowerCase().trim();
    this.address = this.address?.toLowerCase().trim();
    this.city = this.city?.toLowerCase().trim();
    this.createAt = new Date();
  }

  @BeforeUpdate()
  async setDefaultUpdateAt() {
    this.updateAt = new Date();
  }
}
