import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Doctor} from "./controllers-etc/doctor/doctor.entity";
import {Specialty} from "./controllers-etc/specialty/specialty.entity";
import {MedicineSpecialty} from "./controllers-etc/medicine-specialty/medicine-specialty.entity";
import {Medicine} from "./controllers-etc/medicine/medicine.entity";
import {DoctorController} from "./controllers-etc/doctor/doctor.controller";
import {MedicineController} from "./controllers-etc/medicine/medicine.controller";
import {SpecialtyController} from "./controllers-etc/specialty/specialty.controller";
import {MedicineSpecialtyController} from "./controllers-etc/medicine-specialty/medicine-specialty.controller";
import {DoctorService} from "./controllers-etc/doctor/doctor.service";
import {MedicineService} from "./controllers-etc/medicine/medicine.service";
import {SpecialtyService} from "./controllers-etc/specialty/specialty.service";
import {MedicineSpecialtyService} from "./controllers-etc/medicine-specialty/medicine-specialty.service";
import {Patient} from "./controllers-etc/patient/patient.entity";
import {File} from "./controllers-etc/file/file.entity";
import {PatientController} from "./controllers-etc/patient/patient.controller";
import {PatientService} from "./controllers-etc/patient/patient.service";
import {FileController} from "./controllers-etc/file/file.controller";
import {FileService} from "./controllers-etc/file/file.service";
import {Attribute} from "./controllers-etc/file-attribute/attribute.entity";
import {FileAttribute} from "./controllers-etc/file-attribute/file-attribute.entity";
import {FileAttributeController} from "./controllers-etc/file-attribute/file-attribute.controller";
import {FileAttributeService} from "./controllers-etc/file-attribute/file-attribute.service";
import {Contact} from "./controllers-etc/contact/contact.entity";
import {ContactController} from "./controllers-etc/contact/contact.controller";
import {ContactService} from "./controllers-etc/contact/contact.service";
import {Frequency} from "./controllers-etc/frequency/frequency.entity";
import {Rule} from "./controllers-etc/rule/rule.entity";
import {RuleController} from "./controllers-etc/rule/rule.controller";
import {RuleService} from "./controllers-etc/rule/rule.service";
import {Prescription} from "./controllers-etc/prescription/prescription.entity";
import {PrescriptionController} from "./controllers-etc/prescription/prescription.controller";
import {PrescriptionService} from "./controllers-etc/prescription/prescription.service";
import {PrescribedMedicine} from "./controllers-etc/prescribed-medicine/prescribed-medicine.entity";
import {PrescribedMedicineController} from "./controllers-etc/prescribed-medicine/prescribed-medicine.controller";
import {PrescribedMedicineService} from "./controllers-etc/prescribed-medicine/prescribed-medicine.service";
import {PrescriptionRuleViolation} from "./controllers-etc/prescription-rule-violation/prescription-rule-violation.entity";
import {
    PrescriptionRuleViolationController
} from "./controllers-etc/prescription-rule-violation/prescription-rule-violation.controller";
import {PrescriptionRuleViolationService} from "./controllers-etc/prescription-rule-violation/prescription-rule-violation.service";
import {PostgreSQLDatabaseProviderModule} from "./providers/postgre-sql-database-provider.module";

@Module({
    imports: [
        PostgreSQLDatabaseProviderModule,
        TypeOrmModule.forFeature([Doctor, Specialty, Medicine, MedicineSpecialty, Patient, File, Attribute, FileAttribute, Contact, Frequency, Rule, Prescription, PrescribedMedicine, PrescriptionRuleViolation])
    ],
    controllers: [DoctorController, MedicineController, SpecialtyController, MedicineSpecialtyController, PatientController, FileController, FileAttributeController, ContactController, RuleController, PrescriptionController, PrescribedMedicineController, PrescriptionRuleViolationController],
    providers: [DoctorService, MedicineService, SpecialtyService, MedicineSpecialtyService, PatientService, FileService, FileAttributeService, ContactService, RuleService, PrescriptionService, PrescribedMedicineService, PrescriptionRuleViolationService],
})
export class AppModule {
}
