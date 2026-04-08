import { Patient } from '../../patients/entities/patient.entity';
import { User } from '../../auth/entities/user.entity';
import { Location } from '../../locations/entities/location.entity';
export declare enum BillStatus {
    DRAFT = "draft",
    PENDING = "pending",
    PAID = "paid",
    PARTIALLY_PAID = "partially_paid",
    CANCELLED = "cancelled"
}
export declare enum PaymentMethod {
    CASH = "cash",
    CARD = "card",
    UPI = "upi",
    BANK_TRANSFER = "bank_transfer",
    INSURANCE = "insurance"
}
export declare class Bill {
    id: number;
    billNumber: string;
    location: Location;
    locationId: number;
    patient: Patient;
    patientId: number;
    totalAmount: number;
    discountAmount: number;
    taxAmount: number;
    netAmount: number;
    paidAmount: number;
    status: BillStatus;
    paymentMethod: PaymentMethod;
    insuranceClaimId: string;
    createdByUser: User;
    createdBy: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class BillItem {
    id: number;
    bill: Bill;
    billId: number;
    itemName: string;
    itemCode: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    category: string;
}
