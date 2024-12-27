import {Pipe, PipeTransform} from '@angular/core';
import {TicketType} from '../constants';
import {tick} from '@angular/core/testing';


@Pipe({name: 'ticketType', standalone: true})
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
