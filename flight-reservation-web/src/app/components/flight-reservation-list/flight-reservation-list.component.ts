import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {FlightReservationService} from '../../services';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {FlightReservationModel} from '../../models';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FlightReservationDialogComponent} from '../flight-reservation-dialog/flight-reservation-dialog.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {DatePipe} from '@angular/common';
import {MatFormField} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ConfirmDirective} from '../../directives/confirm.directive';
import {TicketTypePipe} from '../../pipes';


@Component({
  selector: 'app-flight-reservation-list',
  templateUrl: 'flight-reservation-list.component.html',
  styleUrl: 'flight-reservation-list.component.scss',
  standalone: true,
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
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    ConfirmDirective,
    TicketTypePipe
  ]
})
export class FlightReservationListComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['id', 'fullName', 'flightNumber', 'departureDate', 'arrivalDate', 'ticketType', 'actions']
  dataSource = new MatTableDataSource<FlightReservationModel>([]);

  constructor(private flightReservationService: FlightReservationService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.fetchFlightReservations()
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private fetchFlightReservations(): void {
    this.subscription.add(
      this.flightReservationService.getFlightReservations().subscribe(data => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    )
  }

  deleteItem(id: string): void {
    this.subscription.add(
      this.flightReservationService.deleteFlightReservation(id).subscribe(() =>
        this.fetchFlightReservations()
      )
    )
  }

  openDialog(element: FlightReservationModel | null = null): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = element;
    // dialogConfig.width = '400px';
    this.dialog.open<FlightReservationDialogComponent, FlightReservationModel | null, FlightReservationModel>(FlightReservationDialogComponent, dialogConfig)
      .afterClosed().subscribe(result => {
      console.log(result)
      if (result) {
        this.fetchFlightReservations();
      }
    })
  }
}
