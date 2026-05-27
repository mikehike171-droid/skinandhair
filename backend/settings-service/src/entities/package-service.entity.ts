import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Package } from './package.entity';

@Entity('package_services')
export class PackageService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  package_id: number;

  @ManyToOne(() => Package, (pkg) => pkg.services)
  @JoinColumn({ name: 'package_id' })
  package: Package;

  @Column()
  category: string;

  @Column()
  service_name: string;

  @Column({ type: 'int' })
  sessions: number;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
}
