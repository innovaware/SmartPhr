import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import * as moment from "moment";
import { DialogEventComponent } from "src/app/dialogs/dialog-event/dialog-event.component";
import { DialogMessageErrorComponent } from 'src/app/dialogs/dialog-message-error/dialog-message-error.component';
import { Evento } from "src/app/models/evento";
import { UserInfo } from 'src/app/models/user';
import { EventiService } from "src/app/service/eventi.service";

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
  index_week: number;

  isCalendarMonthEnabled: boolean = false;
  isCalendarWeekEnabled: boolean = false;

  calendar = [];
  public user: UserInfo;

  constructor(public dialog: MatDialog, public eventiService: EventiService) {
    this.isCalendarMonthEnabled = true;

    //TODO da recuperare le info del utente
    this.user = {
      identify: "123456",
      mansione: "cuoco"
    };
    console.log("user:", this.user);

    this.update_calendar();
  }

  async update_calendar() {
    this.startDay = this.calendar_day.clone().startOf("month").startOf("week");
    this.endDay = this.calendar_day.clone().endOf("month").endOf("week");
    let date = this.startDay.clone().subtract(1, "day");

    let start_week: moment.Moment = this.calendar_day.clone().startOf("week");

    this.calendar = [];
    console.log("date: ", date);

    while (date.isBefore(this.endDay, "day")) {
      let item = {
        days: Array(7)
          .fill(0)
          .map(() => date.add(1, "day").clone()),
        events: Array<Evento[]>(7),
      };

      this.calendar.push(item);

      console.log("calculate index week", this.calendar);
      this.index_week = this.calendar.findIndex(
        (c) => c.days.findIndex((d) => d.isSame(start_week)) > -1
      );

      item.days.map((d, index) =>
        this.eventiService.getEventiByDay(d, this.user).then((e) => {
          if (item.events[index] == undefined) item.events[index] = [];
          e.forEach((evt) => item.events[index].push(evt));
        }).catch(err=> {
          console.error("Error to get Events");
        })
      );
    }
  }

  ngOnInit() {}

  getEvent(calendar: any, index: number) {
    var c = calendar.days.map(function (e, i) {
      return [e, calendar.events[i]];
    });

    if (c[index][1] != undefined)
      return c[index][1].sort((a,b)=>
        (new Date(a.data)).getTime() - (new Date(b.data)).getTime()
      );
  }

  showEvent(evento: Evento) {
    console.log("evento:", evento);
  }

  createEvent(item: moment.Moment, calendar_week: any, index: number) {
    console.log(item, calendar_week, index);

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
          let index_week = this.calendar.findIndex(
            (c) => c.days.findIndex((d) => d.isSame(item)) > -1
          );
          if (this.calendar[index_week].events[index] == undefined)
            this.calendar[index_week].events[index] = [];

          let evento: Evento =  result;
          evento.utente = this.user.identify;
          evento.tipo = this.user.mansione;

          this.eventiService.insertEvento(evento).then((res) => {
            this.calendar[index_week].events[index].push(evento);
          }).catch(err=> {
            console.error("Error to insert Events");
            this.showMessageError("Errore: Inserimento Evento fallito (" + err['status'] + ")");
          });
        }
      });
  }

  async prev() {
    if (this.isCalendarMonthEnabled) {
      this.calendar_day = moment(this.calendar_day)
        .add(-1, "M")
        .clone()
        .startOf("month");
    } else {
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
    } else {
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


  async showMessageError(messageError: string) {
    var dialogRef = this.dialog.open(DialogMessageErrorComponent, {
      panelClass: 'custom-modalbox',
      data: messageError,
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed", result);

      });
  }
}
