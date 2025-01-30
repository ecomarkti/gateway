import { BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('api-keys')
export class ApiKey {

  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column('varchar', { name: 'API_KEY', length: 120 })
  apiKey: string;

  @Column('timestamp', { name: 'CREATED_AT', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamp', { name: 'UPDATED_AT', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  async setUpdatedAt() {
    this.updatedAt = new Date();
  }
}
