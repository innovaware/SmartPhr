import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import * as moment from "moment";
import { DialogEventComponent } from "src/app/dialogs/dialog-event/dialog-event.component";
import { Evento } from "src/app/models/evento";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"],
})
export class CalendarComponent implements OnInit {
  // myMoment: moment.Moment = moment().locale("it");
  today: moment.Moment = moment().locale("it");
  calendar_day: moment.Moment = moment().locale("it");
  startDay: moment.Moment;
  endDay: moment.Moment;

  isCalendarMonthEnabled: boolean = false;
  isCalendarWeekEnabled: boolean = false;

  calendar = [];
  calendar_current_week = [];

  constructor(public dialog: MatDialog) {
    // this.isCalendarMonthEnabled = true;
    this.isCalendarWeekEnabled = true;
    this.update_calendar();
  }

  async update_calendar() {
    this.startDay = this.calendar_day.clone().startOf("month").startOf("week");
    this.endDay = this.calendar_day.clone().endOf("month").endOf("week");
    let date = this.startDay.clone().subtract(1, "day");

    let start_week: moment.Moment = this.calendar_day.clone().startOf("week");
    let end_week: moment.Moment = this.calendar_day.clone().endOf("week");
    let date_week = start_week.clone().subtract(1, "day");

    this.calendar = [];
    this.calendar_current_week = [];

    while (date_week.isBefore(end_week, "day")) {
      this.calendar_current_week.push({
        days: Array(7)
          .fill(0)
          .map(() => date_week.add(1, "day").clone()),
        events: Array<Evento[]>(7),
      });
    }

    while (date.isBefore(this.endDay, "day"))
      this.calendar.push({
        days: Array(7)
          .fill(0)
          .map(() => date.add(1, "day").clone()),
        events: Array<Evento[]>(7),
      });

    // console.log(this.startDay.format("DD/MM/YYYY"));
    // console.log(this.endDay.format("DD/MM/YYYY"));
    // console.log(this.calendar[0].days[0]);
  }

  ngOnInit() {}

  getEvent(calendar: any, index: number) {
    var c = calendar.days.map(function (e, i) {
      return [e, calendar.events[i]];
    });

    if (c[index][1] != undefined) return c[index][1];
  }

  createEvent(item: moment.Moment, calendar: any, index: number) {
    console.log(item, calendar, index);

    if (item.isBefore(this.today, "day")) {
      return;
    }

    var data: Date = item.toDate();
    data.setHours(new Date().getHours());

    var event: Evento = {
      data: data,
      descrizione: "",
      tipo: "",
      utente: "",
    };

    var dialogRef = this.dialog.open(DialogEventComponent, {
      data: event,
    });
    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed", result);
        if (result instanceof Object) {
          if (calendar.events[index] === undefined) calendar.events[index] = [];

          calendar.events[index].push(result);
        }
        //  this.animal = result;
      });
  }

  async prev() {
    if (this.isCalendarMonthEnabled) {
      this.calendar_day = moment(this.calendar_day)
        .add(-1, "M")
        .clone()
        .startOf("month");
    }
    else {
      this.calendar_day = moment(this.calendar_day)
      .add(-1, "w")
      .clone()
      .startOf("week");
    }

    this.update_calendar();
  }

  async succ() {
    if (this.isCalendarMonthEnabled) {
      this.calendar_day = moment(this.calendar_day)
        .add(1, "M")
        .clone()
        .startOf("month");
    }
    else {
      this.calendar_day = moment(this.calendar_day)
      .add(1, "w")
      .clone()
      .startOf("week");
    }

    this.update_calendar();
  }

  async calendarMonth() {
    this.isCalendarMonthEnabled = true;
    this.isCalendarWeekEnabled = false;
  }

  async calendarWeek() {
    this.isCalendarMonthEnabled = false;
    this.isCalendarWeekEnabled = true;
  }
}
