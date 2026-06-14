import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Doctor, DoctorSchedule } from '../../core/interface/doctor-schedule.interface';
import { AlertService } from '../../core/services/alert.service';
import { DoctorScheduleService } from '../../core/services/doctor-schedule.service';
import { DoctorService } from '../../core/services/doctor.service';

@Component({
  selector: 'app-doctor-schedules',
  standalone: false,
  templateUrl: './doctor-schedules.component.html',
  styleUrl: './doctor-schedules.component.css'
})
export class DoctorSchedulesComponent implements OnInit {

  currentView: 'config' | 'weekly' = 'config';
  days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  colors = ['blue', 'green', 'purple', 'orange', 'pink', 'teal'];
  months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  // Datos
  doctors: Doctor[] = [];
  selectedDoctor: Doctor | null = null;
  schedules: DoctorSchedule[] = [];
  loading = false;

  // Modal para horario por día
  isScheduleModalOpen = false;
  selectedDay: Date | null = null;
  scheduleForm: FormGroup;

  // Modal para asignar médico en vista semanal
  isAssignDoctorModalOpen = false;
  assignDoctorForm: FormGroup;
  bulkAssignMode = false;


  modalMode: 'create' | 'edit' | 'assign' = 'create';

  selectedSchedule: DoctorSchedule | null = null;

  // Vista semanal
  weekDays: Date[] = [];
  weekHours: string[] = [];
  weeklyMatrix: any[][] = [];
  selectedWeekStart: Date = new Date();

  // Selección múltiple en vista semanal
  selectedCellIndices: { hourIndex: number; dayIndex: number }[] = [];
  isSelecting = false;
  selectionStartCell: { hourIndex: number; dayIndex: number } | null = null;

  // Colores para médicos
  doctorColors: { [key: number]: string } = {};

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private scheduleService: DoctorScheduleService,
    private doctorService: DoctorService
  ) {
    this.scheduleForm = this.fb.group({
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      slot_duration: [30, Validators.required]
    });

    this.assignDoctorForm = this.fb.group({
      doctor_id: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      slot_duration: [30, Validators.required],
      applyToAll: [false]
    });
  }

  ngOnInit(): void {
    this.generateWeekHours();
    this.updateWeekDays();
    this.loadDoctors();
    this.loadAllSchedules();
  }


  loadDoctors() {

    this.doctorService.getAll({
      skip: 1,
      take: 9999,
      status: 'A'
    })
      .subscribe({

        next: (res) => {

          this.doctors = res.data.map((item: any) => {

            const specialties = item.doctor_specialties?.map((ds: any) => ds.specialties) ?? [];

            return {
              id: item.id,
              name: `Dr. ${item.persons.first_name} ${item.persons.last_name}`,
              specialty: specialties.map((s: any) => s.name).join(', '),
              specialty_ids: specialties.map((s: any) => s.id),
              specialties
            };

          });

          this.doctors.forEach((d, i) => {
            this.doctorColors[d.id] = this.colors[i % this.colors.length];
          });

          if (this.doctors.length) {
            this.selectedDoctor = this.doctors[0];
            this.loadDoctorSchedules();
          }
        },

        error: () => {
          this.alertService.error('Error cargando médicos');
        }

      });
  }

  loadAllSchedules() {

    this.scheduleService
      .getByDoctor(1)
      .subscribe({
        next: (res) => {

          this.schedules = res.map((s: any) => ({
            ...s,
            schedule_date: s.schedule_date,
            start_time: s.start_time,
            end_time: s.end_time
          }));

          this.buildWeeklyMatrix();
        },
        error: () => {
          this.alertService.error('Error cargando horarios');
        }
      });

  }


  loadDoctorSchedules() {

    if (!this.selectedDoctor) return;

    this.loading = true;

    this.scheduleService
      .getByDoctor(this.selectedDoctor.id)
      .subscribe({
        next: (res) => {

          this.schedules = res.map((s: any) => ({
            ...s,
            schedule_date: s.schedule_date,
            start_time: s.start_time,
            end_time: s.end_time
          }));

          this.loading = false;
          this.buildWeeklyMatrix();
        },

        error: () => {
          this.loading = false;
          this.alertService.error('Error cargando horarios');
        }
      });
  }

  getSchedulesForDay(date: Date) {

    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    return this.schedules.filter(s => {
      const sDate = s.schedule_date.substring(0, 10);

      return (
        sDate === dateStr &&
        s.is_active &&
        s.doctor_id === this.selectedDoctor?.id
      );

    });

  }

  getDayName(date: Date | null): string {
    if (!date) return '';
    return this.days[date.getDay()];
  }

  openScheduleModal(day: Date) {

    this.modalMode = 'create';

    this.selectedSchedule = null;
    this.selectedDay = day;

    this.scheduleForm.reset({
      start_time: '08:00',
      end_time: '12:00',
      slot_duration: 30
    });

    this.isScheduleModalOpen = true;
  }

  editSchedule(schedule: DoctorSchedule) {

    this.modalMode = 'edit';

    this.selectedSchedule = schedule;
    this.selectedDay = new Date(schedule.schedule_date);

    this.scheduleForm.patchValue({
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      slot_duration: schedule.slot_duration
    });

    this.isScheduleModalOpen = true;
  }

  deleteSchedule(schedule: DoctorSchedule) {
    this.scheduleService
      .delete(schedule.id)
      .subscribe({
        next: () => {
          this.alertService.success('Horario eliminado');
          this.loadDoctorSchedules();
        },
        error: () => {
          this.alertService.error('No se pudo eliminar');
        }
      });
  }

  saveSchedule() {

    if (this.scheduleForm.invalid) {
      this.alertService.warning('Complete los campos');
      return;
    }

    if (!this.selectedDay || !this.selectedDoctor) return;

    const value = this.scheduleForm.value;

    const payload = {
      doctor_id: this.selectedDoctor.id,
      schedules: [
        {
          schedule_date: this.selectedDay.toISOString().substring(0, 10),
          start_time: value.start_time,
          end_time: value.end_time,
          slot_duration: Number(value.slot_duration)
        }
      ]
    };

    this.scheduleService
      .create(payload)
      .subscribe({
        next: () => {
          this.alertService.success('Horario guardado');
          this.isScheduleModalOpen = false;
          this.loadDoctorSchedules();
        },
        error: (err) => {
          this.alertService.error(err.error.message ?? 'Error guardando horario'
          );
        }
      });
  }

  // ==================== VISTA SEMANAL ====================

  generateWeekHours() {
    this.weekHours = [];
    for (let hour = 7; hour <= 19; hour++) {
      this.weekHours.push(`${hour.toString().padStart(2, '0')}:00`);
    }
  }

  updateWeekDays() {
    const startOfWeek = new Date(this.selectedWeekStart);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      this.weekDays.push(date);
    }
  }

  previousWeek() {
    this.selectedWeekStart.setDate(this.selectedWeekStart.getDate() - 7);
    this.updateWeekDays();
    this.clearSelection();
    this.buildWeeklyMatrix();
  }

  nextWeek() {
    this.selectedWeekStart.setDate(this.selectedWeekStart.getDate() + 7);
    this.updateWeekDays();
    this.clearSelection();
    this.buildWeeklyMatrix();
  }

  openContextMenu(event: MouseEvent, hourIndex: number, dayIndex: number) {
    event.preventDefault();
    this.clearSelection();
    this.selectedCellIndices = [{ hourIndex, dayIndex }];
    this.bulkAssignMode = false;
    this.assignDoctorForm.reset({
      doctor_id: '',
      start_time: this.weekHours[hourIndex],
      end_time: `${parseInt(this.weekHours[hourIndex].split(':')[0]) + 1}:00`,
      slot_duration: 30,
      applyToAll: false
    });
    this.isAssignDoctorModalOpen = true;
  }

  buildWeeklyMatrix() {

    this.weeklyMatrix = this.weekHours.map(() => Array(7).fill(null));


    this.schedules.forEach(schedule => {

      const doctor = this.doctors.find(
        d => d.id === schedule.doctor_id
      );

      if (!doctor) return;


      const scheduleDate = schedule.schedule_date.substring(0, 10);


      const dayIndex = this.weekDays.findIndex(d => {

        const date =
          `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

        return date === scheduleDate;

      });


      if (dayIndex === -1) return;



      const startMinutes = this.timeToMinutes(schedule.start_time);
      const endMinutes = this.timeToMinutes(schedule.end_time);



      for (let hourIndex = 0; hourIndex < this.weekHours.length; hourIndex++) {


        const cellStart = this.timeToMinutes(this.weekHours[hourIndex]);
        const cellEnd = cellStart + 60;


        // Si el horario toca esta hora
        if (
          startMinutes < cellEnd &&
          endMinutes > cellStart
        ) {


          const occupiedStart = Math.max(
            startMinutes,
            cellStart
          );


          const occupiedEnd = Math.min(
            endMinutes,
            cellEnd
          );


          const minutesOccupied =
            occupiedEnd - occupiedStart;


          const percentage =
            (minutesOccupied / 60) * 100;



          if (!this.weeklyMatrix[hourIndex][dayIndex]) {
            this.weeklyMatrix[hourIndex][dayIndex] = [];
          }


          // evitar duplicados
          const exists =
            this.weeklyMatrix[hourIndex][dayIndex]
              .some(
                (x: any) => x.doctor.id === doctor.id
              );


          if (!exists) {

            this.weeklyMatrix[hourIndex][dayIndex]
              .push({

                doctor,

                schedule,

                percentage

              });

          }

        }

      }


    });

  }

  timeToMinutes(time: string) {

    const [h, m] = time.split(':')
      .map(Number);

    return h * 60 + m;

  }

  isCellSelected(hourIndex: number, dayIndex: number): boolean {
    return this.selectedCellIndices.some(
      cell => cell.hourIndex === hourIndex && cell.dayIndex === dayIndex
    );
  }

  startCellSelection(event: MouseEvent, hourIndex: number, dayIndex: number) {
    event.preventDefault();
    this.isSelecting = true;
    this.selectionStartCell = { hourIndex, dayIndex };
    this.selectedCellIndices = [{ hourIndex, dayIndex }];
  }

  continueCellSelection(hourIndex: number, dayIndex: number) {
    if (!this.isSelecting || !this.selectionStartCell) return;

    // Calcular el rango de selección
    const startHour = Math.min(this.selectionStartCell.hourIndex, hourIndex);
    const endHour = Math.max(this.selectionStartCell.hourIndex, hourIndex);
    const startDay = Math.min(this.selectionStartCell.dayIndex, dayIndex);
    const endDay = Math.max(this.selectionStartCell.dayIndex, dayIndex);

    // Seleccionar todas las celdas en el rango
    const newSelection: { hourIndex: number; dayIndex: number }[] = [];
    for (let h = startHour; h <= endHour; h++) {
      for (let d = startDay; d <= endDay; d++) {
        newSelection.push({ hourIndex: h, dayIndex: d });
      }
    }
    this.selectedCellIndices = newSelection;
  }

  endCellSelection() {
    if (this.isSelecting) {
      this.isSelecting = false;
      this.selectionStartCell = null;

      if (this.selectedCellIndices.length > 0) {
        setTimeout(() => {
          this.openAssignDoctorModal();
        }, 100);
      }
    }
  }

  clearSelection() {
    this.selectedCellIndices = [];
    this.isSelecting = false;
    this.selectionStartCell = null;
  }

  openAssignDoctorModal() {

    if (!this.selectedCellIndices.length) return;

    this.modalMode = 'assign';

    const first = this.selectedCellIndices[0];

    const start = this.weekHours[first.hourIndex];

    let doctorAsignado = '';

    const cellData = this.weeklyMatrix[first.hourIndex]?.[first.dayIndex];

    if (cellData && cellData.length > 0) {

      doctorAsignado = cellData[0].doctor.id;

    }

    this.assignDoctorForm.reset({
      doctor_id: doctorAsignado,
      start_time: start,
      end_time: `${String(parseInt(start) + 1).padStart(2, '0')}:00`,
      slot_duration: 30,
      applyToAll: false
    });

    this.isAssignDoctorModalOpen = true;
  }

  openEditAssign(hourIndex: number, dayIndex: number) {

    const cell = this.weeklyMatrix[hourIndex]?.[dayIndex];

    if (cell?.length) {

      this.selectedCellIndices = [
        {
          hourIndex,
          dayIndex
        }
      ];

      this.openAssignDoctorModal();

    }

  }

  assignDoctorToCells() {

    if (this.assignDoctorForm.invalid) {
      return;
    }

    const formValue = this.assignDoctorForm.value;

    const grouped: any = {};

    this.selectedCellIndices.forEach(cell => {

      const day =
        this.weekDays[cell.dayIndex]
          .toISOString()
          .substring(0, 10);


      const hour = this.weekHours[cell.hourIndex];

      if (!grouped[day]) {

        grouped[day] = {
          schedule_date: day,
          start_time: hour,
          end_time: hour,
          slot_duration: formValue.slot_duration
        };

      } else {

        // menor hora
        if (
          this.timeToMinutes(hour) <
          this.timeToMinutes(grouped[day].start_time)
        ) {
          grouped[day].start_time = hour;
        }

        const endHour = `${String(Number(hour.split(':')[0]) + 1).padStart(2, '0')}:00`;

        if (
          this.timeToMinutes(endHour) >
          this.timeToMinutes(grouped[day].end_time)
        ) {
          grouped[day].end_time = endHour;
        }
      }
    });

    const payload = {
      doctor_id: Number(formValue.doctor_id),
      schedules: Object.values(grouped)
    };

    this.scheduleService
      .create(payload)
      .subscribe({
        next: (res) => {
          this.alertService.success(`${res.total} horarios creados`);
          this.isAssignDoctorModalOpen = false;
          this.clearSelection();
          this.loadAllSchedules();
        },

        error: (err) => {
          this.alertService.error(err.error.message ?? 'Error creando horarios');
        }
      });
  }

  clearCellSchedule(hourIndex: number, dayIndex: number, doctorId: number, event: MouseEvent) {
    event.stopPropagation();
    const scheduleToRemove = this.weeklyMatrix[hourIndex]?.[dayIndex]?.find(
      (item: any) => item.doctor.id === doctorId
    );

    if (scheduleToRemove) {
      this.schedules = this.schedules.filter(s => s.id !== scheduleToRemove.schedule.id);
      this.buildWeeklyMatrix();
      this.alertService.success('Horario eliminado correctamente');
    }
  }

  getWeekRange(): string {
    if (this.weekDays.length === 0) return '';
    const start = this.weekDays[0];
    const end = this.weekDays[6];
    return `${start.getDate()} – ${end.getDate()} ${this.months[end.getMonth()]} ${end.getFullYear()}`;
  }

  @HostListener('document:mouseup')
  onGlobalMouseUp() {
    if (this.isSelecting) {
      this.endCellSelection();
    }
  }

}