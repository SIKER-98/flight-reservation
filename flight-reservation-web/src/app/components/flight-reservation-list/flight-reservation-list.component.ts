import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatNoDataRow,
  MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FlightReservationDialogComponent} from '../flight-reservation-dialog/flight-reservation-dialog.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {DatePipe, UpperCasePipe} from '@angular/common';
import {MatFormField} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ConfirmDirective} from '../../directives/confirm.directive';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {TicketTypePipe} from '../../pipes/ticket-type.pipe';
import {FlightReservationModel} from '../../models/flight-reservation.model';
import {FlightReservationService} from '../../services/flight-reservation.service';


@Component({
  selector: 'app-flight-reservation-list',
  templateUrl: 'flight-reservation-list.component.html',
  styleUrl: 'flight-reservation-list.component.scss',
  imports: [
    MatTable,
    MatColumnDef,
    MatSort,
    MatHeaderCell,
    MatCell,
    MatIconButton,
    MatIcon,
    MatHeaderRow,
    MatRow,
    MatSortHeader,
    DatePipe,
    MatPaginator,
    MatButton,
    MatFormField,
    MatInputModule,
    ConfirmDirective,
    TicketTypePipe,
    MatNoDataRow,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    UpperCasePipe,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef
  ]
})
export class FlightReservationListComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['id', 'fullName', 'flightNumber', 'departureDate', 'arrivalDate', 'ticketType', 'actions']
  dataSource = new MatTableDataSource<FlightReservationModel>([]);

  constructor(private flightReservationService: FlightReservationService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.fetchFlightReservations()

    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
      if (typeof data[sortHeaderId] === 'string') {
        return data[sortHeaderId].toLocaleUpperCase();
      }
      return data[sortHeaderId];
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private fetchFlightReservations(): void {
    this.flightReservationService.getFlightReservations()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  deleteItem(id: string): void {
    this.flightReservationService.deleteFlightReservation(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() =>
        this.fetchFlightReservations()
      );
  }

  deleteAllItems(): void {
    this.flightReservationService.clearFlightReservations()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() =>
        this.fetchFlightReservations()
      );
  }

  openDialog(element: FlightReservationModel | null = null): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = element;
    this.dialog.open<FlightReservationDialogComponent, FlightReservationModel | null, FlightReservationModel>(FlightReservationDialogComponent, dialogConfig)
      .afterClosed().subscribe(result => {
      if (result) {
        this.fetchFlightReservations();
      }
    })
  }

  applyFilter($event: Event): void {
    const filterValue = ($event.target as HTMLInputElement).value.toLowerCase();

    if (this.dataSource.filter !== filterValue) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    this.flightReservationService.getFlightReservations()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => this.dataSource.data = data)
  }
}
