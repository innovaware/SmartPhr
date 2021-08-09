import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  // myMoment: moment.Moment = moment().locale("it");
  today: moment.Moment = moment().locale("it");
  startDay: moment.Moment;
  endDay: moment.Moment;

  calendar = [];

  constructor() {
    this.startDay = this.today.clone().startOf('month').startOf('week');
    this.endDay = this.today.clone().endOf('month').endOf('week');
    let date = this.startDay.clone().subtract(1, 'day');

    while (date.isBefore(this.endDay, 'day'))
    this.calendar.push({
        days: Array(7).fill(0).map(() => date.add(1, 'day').clone())
    });

    console.log(this.startDay.format("DD/MM/YYYY"));
    console.log(this.endDay.format("DD/MM/YYYY"));
    console.log(this.calendar[0].days[0]);
  }

  ngOnInit() {
  }

}
