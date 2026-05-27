import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Package } from '../entities/package.entity';
import { PackageService as PackageServiceEntity } from '../entities/package-service.entity';
import { PatientPackage } from '../entities/patient-package.entity';
import { PatientPackageUsage } from '../entities/patient-package-usage.entity';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package)
    private packageRepository: Repository<Package>,
    @InjectRepository(PackageServiceEntity)
    private packageServiceRepository: Repository<PackageServiceEntity>,
    @InjectRepository(PatientPackage)
    private patientPackageRepository: Repository<PatientPackage>,
    @InjectRepository(PatientPackageUsage)
    private packageUsageRepository: Repository<PatientPackageUsage>,
  ) {}

  async findAll(): Promise<Package[]> {
    return this.packageRepository.find({ relations: ['services'] });
  }

  async create(data: any): Promise<Package> {
    const pkg = this.packageRepository.create({
      name: data.name,
      duration_days: parseInt(data.duration_days) || 30,
      validity_till: (data.validity_till && data.validity_till !== '') ? new Date(data.validity_till) : null,
      package_price: parseFloat(data.package_price) || 0,
    });

    const savedPkg = await this.packageRepository.save(pkg);

    if (data.services && data.services.length > 0) {
      const services = data.services.map((s) =>
        this.packageServiceRepository.create({
          package_id: savedPkg.id,
          category: s.category || 'Service',
          service_name: s.service_name,
          sessions: parseInt(s.sessions) || 1,
          quantity: parseInt(s.quantity) || 1,
          price: parseFloat(s.price) || 0,
        }),
      );
      await this.packageServiceRepository.save(services);
    }

    return this.packageRepository.findOne({ where: { id: savedPkg.id }, relations: ['services'] });
  }

  async assignToPatient(data: any): Promise<PatientPackage> {
    const pkg = await this.packageRepository.findOne({ where: { id: data.package_id } });
    if (!pkg) throw new NotFoundException('Package not found');

    const purchaseDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(purchaseDate.getDate() + pkg.duration_days);

    const patientPackage = this.patientPackageRepository.create({
      patient_id: data.patient_id,
      package_id: data.package_id,
      purchase_date: purchaseDate,
      expiry_date: expiryDate,
      amount_paid: data.amount_paid || pkg.package_price,
      status: 'Active',
    });

    return this.patientPackageRepository.save(patientPackage);
  }

  async getPatientPackages(patientId: string): Promise<any[]> {
    const packages = await this.patientPackageRepository.find({
      where: { patient_id: patientId, status: 'Active' },
      relations: ['package', 'package.services'],
    });

    // For each package, calculate remaining sessions
    const results = await Promise.all(
      packages.map(async (pp) => {
        const usages = await this.packageUsageRepository.find({
          where: { patient_package_id: pp.id },
        });

        const servicesWithUsage = pp.package.services.map((ps) => {
          const used = usages
            .filter((u) => u.package_service_id === ps.id)
            .reduce((sum, u) => sum + u.sessions_used, 0);
          return {
            ...ps,
            sessions_used: used,
            sessions_remaining: ps.sessions - used,
          };
        });

        return {
          ...pp,
          services: servicesWithUsage,
        };
      }),
    );

    return results;
  }

  async useSession(data: { patient_package_id: number; package_service_id: number; examination_id: number; sessions: number }) {
    const usage = this.packageUsageRepository.create({
      patient_package_id: data.patient_package_id,
      package_service_id: data.package_service_id,
      examination_id: data.examination_id,
      sessions_used: data.sessions || 1,
    });
    return this.packageUsageRepository.save(usage);
  }
}
