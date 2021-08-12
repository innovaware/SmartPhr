import { Component, OnInit } from "@angular/core";
import { MatDialog } from '@angular/material';
import * as moment from "moment";
import { DialogEventComponent } from 'src/app/dialogs/dialog-event/dialog-event.component';
import { Evento } from 'src/app/models/evento';

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"],
})
export class CalendarComponent implements OnInit {
  // myMoment: moment.Moment = moment().locale("it");
  today: moment.Moment = moment().locale("it");
  startDay: moment.Moment;
  endDay: moment.Moment;

  calendar = [];

  constructor(public dialog: MatDialog) {
    this.startDay = this.today.clone().startOf("month").startOf("week");
    this.endDay = this.today.clone().endOf("month").endOf("week");
    let date = this.startDay.clone().subtract(1, "day");

    while (date.isBefore(this.endDay, "day"))
      this.calendar.push({
        days: Array(7)
          .fill(0)
          .map(() => date.add(1, "day").clone()),
        events: Array<Evento[]>(7)
      });

    // console.log(this.startDay.format("DD/MM/YYYY"));
    // console.log(this.endDay.format("DD/MM/YYYY"));
    // console.log(this.calendar[0].days[0]);
  }

  ngOnInit() {}


  getEvent(calendar: any, index: number) {
    var c = calendar.days.map(function(e, i) {
      return [e, calendar.events[i]];
    });

    if (c[index][1] != undefined)
    return c[index][1];
  }

  createEvent(item: moment.Moment, calendar: any, index: number) {
    console.log(item, calendar, index);

    if (item.isBefore(this.today,'day')) {
      return;
    }

    var data: Date = item.toDate()
    data.setHours(new Date().getHours());

    var event: Evento = {
      data: data,
      descrizione: "",
      tipo: "",
      utente: ""
    }

    var dialogRef = this.dialog.open(DialogEventComponent, {
      data: event,
    });
    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed", result);
        if (result instanceof Object) {
          if (calendar.events[index] === undefined)
          calendar.events[index] = [];

          calendar.events[index].push(result);
        }
        //  this.animal = result;
      });
  }
}
