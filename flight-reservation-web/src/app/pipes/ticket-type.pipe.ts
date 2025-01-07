import {Pipe, PipeTransform} from '@angular/core';
import {TicketType} from '../constants';


@Pipe({name: 'ticketType'})
export class TicketTypePipe implements PipeTransform {
  transform(ticketType: TicketType): string {
    switch (ticketType) {
      case TicketType.Economic:
        return "Ekonomiczny";
      case TicketType.Business:
        return "Biznes";
    }
  }
}
