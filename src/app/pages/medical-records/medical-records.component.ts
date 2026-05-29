import { Component, OnInit } from '@angular/core';
import { FormField } from '../../core/interface/form-field.interface';
import { MedicalRecord } from '../../core/interface/medical-record.interface';
import { Patient } from '../../core/interface/patient.interface';
import { AlertService } from '../../core/services/alert.service';
import { AppointmentsService } from '../../core/services/appointment.service';
import { MedicalRecordsService } from '../../core/services/medica-record.service';
import { PatientsService } from '../../core/services/patients.service';

@Component({
  selector: 'app-medical-records',
  standalone: false,
  templateUrl: './medical-records.component.html',
  styleUrl: './medical-records.component.css'
})
export class MedicalRecordsComponent implements OnInit {

  searchTerm = '';
  loading = false;

  patients: Patient[] = [];
  selectedPatient: Patient | null = null;

  medicalRecords: MedicalRecord[] = [];

  selectedMedicalRecord: any = null;

  isModalOpen = false;

  mode: 'create' | 'edit' | 'view' = 'create';

  /* DELETE */
  showDeleteModal = false;
  medicalRecordToDelete: any = null;
  appointments: any[] = [];
  diseases = [
    { label: 'Migraña', value: 16 },
    { label: 'Hipertensión', value: 17 },
    { label: 'Laboratorio Normal', value: 18 }
  ];

  formFields: FormField[] = [
    {
      name: 'appointment_id',
      label: 'Cita',
      type: 'select',
      required: true,
      options: []
    },
    {
      name: 'disease_id',
      label: 'Enfermedad',
      type: 'select',
      required: true,
      options: []
    },
    {
      name: 'diagnosis',
      label: 'Diagnóstico',
      type: 'textarea',
      required: true
    },
    {
      name: 'treatment',
      label: 'Tratamiento',
      type: 'textarea',
      required: true
    },
    {
      name: 'observations',
      label: 'Observaciones',
      type: 'textarea',
      required: false
    }
  ];

  patientStats = {
    totalVisits: 0,
    totalDiagnostics: 0,
    totalPrescriptions: 0
  };

  constructor(
    private alertService: AlertService,
    private servicePatients: PatientsService,
    private medicalRecordsService: MedicalRecordsService,
    private serviceAppointment: AppointmentsService,
  ) { }

  ngOnInit(): void {
    this.loadDiseases();
    this.loadPatients();
    this.loadMedicalRecords();
    this.loadAppointments();
  }

  loadDiseases(): void {

    const field = this.formFields.find(
      f => f.name === 'disease_id'
    );

    if (field) {

      field.options = this.diseases.map(item => ({
        label: item.label,
        value: item.value
      }));
    }
  }

  openCreate(): void {

    if (!this.selectedPatient) {
      this.alertService.warning(
        'Seleccione un paciente primero'
      );
      return;
    }

    this.selectedMedicalRecord = {
      appointment_id: '',
      disease_id: '',
      diagnosis: '',
      treatment: '',
      observations: ''
    };

    this.mode = 'create';
    this.isModalOpen = true;
  }

  onEdit(record: any): void {

    this.selectedMedicalRecord = {
      ...record
    };

    this.mode = 'edit';
    this.isModalOpen = true;
  }

  onSave(data: any): void {

    const payload = {
      appointment_id: data.appointment_id,
      disease_id: data.disease_id,
      diagnosis: data.diagnosis,
      treatment: data.treatment,
      observations: data.observations
    };

    if (this.selectedMedicalRecord?.id) {

      console.log('UPDATE', payload);

      this.alertService.success(
        'Historial clínico actualizado correctamente'
      );

    } else {

      console.log('CREATE', payload);

      this.alertService.success(
        'Historial clínico creado correctamente'
      );
    }

    this.isModalOpen = false;
  }

  onDelete(record: any): void {
    this.medicalRecordToDelete = record;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {

    if (!this.medicalRecordToDelete) {
      return;
    }

    console.log('DELETE', this.medicalRecordToDelete.id);

    this.alertService.success(
      'Historial clínico eliminado correctamente'
    );

    this.showDeleteModal = false;
    this.medicalRecordToDelete = null;
  }

  getModalTitle(): string {

    if (!this.medicalRecordToDelete) {
      return '';
    }

    return 'Eliminar historial clínico';
  }

  getModalMessage(): string {

    if (!this.medicalRecordToDelete) {
      return '';
    }

    return `¿Está seguro de eliminar este historial clínico?`;
  }

  get filteredPatients(): Patient[] {

    if (!this.searchTerm.trim()) {
      return this.patients;
    }

    const term = this.searchTerm.toLowerCase();

    return this.patients.filter(p =>
      p.first_name.toLowerCase().includes(term) ||
      p.last_name.toLowerCase().includes(term) ||
      p.identification.includes(term)
    );
  }

  selectPatient(patient: Patient): void {
    this.selectedPatient = patient;
    this.calculatePatientStats();
  }

  calculatePatientStats(): void {

    if (!this.selectedPatient) {
      return;
    }

    const patientRecords = this.medicalRecords.filter(
      record => record.appointments.patient_id === this.selectedPatient!.id
    );

    this.patientStats = {
      totalVisits: patientRecords.length,
      totalDiagnostics: patientRecords.length,
      totalPrescriptions: patientRecords.filter(
        r => r.treatment
      ).length
    };
  }

  getPatientRecords(): MedicalRecord[] {

    if (!this.selectedPatient) {
      return [];
    }

    return this.medicalRecords.filter(
      record => record.appointments.patient_id === this.selectedPatient!.id
    );
  }

  getFullName(patient: Patient): string {
    return `${patient.first_name} ${patient.last_name}`;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  loadPatients() {

    this.loading = true;
    const currentFilters = {
      skip: 1,
      take: 9999
    }

    this.servicePatients
      .getAll(currentFilters)
      .subscribe({

        next: (res) => {

          this.patients = res.data.map((item: any) => {

            return {
              id: item.id,
              identification: item.persons?.identification || '',
              document_type_id: item.persons?.document_type_id || null,
              first_name: item.persons?.first_name || '',
              last_name: item.persons?.last_name || '',
              patient: `${item.persons?.first_name || ''} ${item.persons?.last_name || ''}`,
              phone: item.persons?.phone || '',
              email: item.persons?.email || '',
              address: item.persons?.address || '',
              gender_id: item.persons?.gender_id || null,
              nationality_id: item.persons?.nationality_id || null,
              birth_date: item.persons?.birth_date ? item.persons.birth_date.split('T')[0] : ''
            };
          });
          this.loading = false;
        },

        error: () => {
          this.loading = false;
          this.alertService.error(
            'Error al cargar pacientes'
          );
        }
      });
  }

  loadMedicalRecords(): void {

    this.loading = true;

    const filters = {
      skip: 1,
      take: 9999
    };

    this.medicalRecordsService
      .getAll(filters)
      .subscribe({

        next: (res) => {

          this.medicalRecords = res.data.map((item: any) => {

            return {

              id: item.id,

              appointment_id: item.appointment_id,
              disease_id: item.disease_id,

              diagnosis: item.diagnosis,
              treatment: item.treatment,
              observations: item.observations,

              created_at: item.created_at,
              updated_at: item.updated_at,
              deleted_at: item.deleted_at,

              appointments: item.appointments,

              catalogs: item.catalogs

            };

          });

          this.loading = false;

        },

        error: () => {

          this.loading = false;

          this.alertService.error(
            'Error al cargar historial clínico'
          );

        }

      });

  }
  loadAppointments(): void {

    const filters = {
      skip: 1,
      take: 9999
    };

    this.serviceAppointment
      .getAll(filters)
      .subscribe({

        next: (res) => {

          this.appointments = res.data;

          const field = this.formFields.find(
            f => f.name === 'appointment_id'
          );

          if (field) {

            field.options = res.data.map((item: any) => ({

              value: item.id,

              label:
                `${item.patients?.persons?.first_name || ''} ` +
                `${item.patients?.persons?.last_name || ''} - ` +
                `${item.appointment_date?.split('T')[0] || ''}`

            }));

          }

        },

        error: () => {

          this.alertService.error(
            'Error al cargar citas médicas'
          );

        }

      });

  }

  getLastAppointmentDate(patient: Patient): string {
    const lastRecord = this.medicalRecords
      .filter(r => r.appointments.patient_id === patient.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

    if (!lastRecord) return 'Sin visitas';
    return this.formatDate(lastRecord.created_at);
  }

}