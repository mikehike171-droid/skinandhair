import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PackageService } from './package-service.entity';

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'int' })
  duration_days: number;

  @Column({ type: 'date', nullable: true })
  validity_till: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  package_price: number;

  @OneToMany(() => PackageService, (service) => service.package, { cascade: true })
  services: PackageService[];

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
