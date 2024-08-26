import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import * as moment from "moment";
import { DialogEventComponent } from "src/app/dialogs/dialog-event/dialog-event.component";
import { DialogMessageErrorComponent } from "src/app/dialogs/dialog-message-error/dialog-message-error.component";
import { Evento } from "src/app/models/evento";
import { UserInfo } from "src/app/models/userInfo";
import { EventiService } from "src/app/service/eventi.service";
import { MessagesService } from "src/app/service/messages.service";
import { AuthenticationService } from "src/app/service/authentication.service";
import { User } from 'src/app/models/user';
import { Dipendenti } from "../../models/dipendenti";
import { TurnimensiliService } from "../../service/turnimensili.service";
import { Turnimensili } from "../../models/turnimensili";
import { DipendentiService } from "../../service/dipendenti.service";
import { DialogTurniComponent } from "../../dialogs/dialog-turni/dialog-turni.component";
import { MansioniService } from "../../service/mansioni.service";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"],
})
export class CalendarComponent implements OnInit {
  @Input() data: Dipendenti;
  @Input() tipo: string;
  @Input() url: string;
  dipendente: Dipendenti;
  @Input() isTurni: boolean;
  // myMoment: moment.Moment = moment().locale("it");
  today: moment.Moment = moment().locale("it");
  calendar_day: moment.Moment = moment().locale("it");
  startDay: moment.Moment;
  endDay: moment.Moment;
  index_week: number;

  isCalendarMonthEnabled: boolean = false;
  isCalendarWeekEnabled: boolean = false;

  turni: boolean;
  calendar = [];
  public user: UserInfo;

  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService,
    public eventiService: EventiService,
    private authenticationService: AuthenticationService,
    public dipendenteService: DipendentiService,
    public mansioniService: MansioniService,
    public turniService: TurnimensiliService,
  ) {
    var username = "";
    var descrizione = "";
    this.isCalendarMonthEnabled = true;
    this.user = { identify: '', mansione: '' };

    authenticationService.getCurrentUserAsync().subscribe({
      next: (res) => {
        this.user.identify = res.username;
        dipendenteService.getById(res.dipendenteID).then((ris) => {
          mansioniService.getById(ris.mansione).then((r) => {
            this.user.mansione = r.descrizione;
          }).catch((error) => {
            console.error('Errore durante il recupero della mansione:', error);
          });
        }).catch((error) => {
          console.error('Errore durante il recupero del dipendente:', error);
        });
      },
      error: (error) => {
        console.error('Errore durante il recupero dell\'utente corrente:', error);
      }
    });


  }

  async update_calendar() {
    this.startDay = this.calendar_day.clone().startOf("month").startOf("week");
    this.endDay = this.calendar_day.clone().endOf("month").endOf("week");
    let date = this.startDay.clone().subtract(1, "day");
    let start_week: moment.Moment = this.calendar_day.clone().startOf("week");
    this.calendar = [];

    if (this.turni == false) {
      if (this.tipo == "" || this.tipo == undefined || this.tipo == null) {
        this.eventiService
          .getEventiByIntervalDay(date, this.endDay, this.user)
          .subscribe(
            (eventi: Evento[]) => {

              while (date.isBefore(this.endDay, "day")) {
                let item = {
                  days: Array(7)
                    .fill(0)
                    .map(() => date.add(1, "day").clone()),
                  events: Array<Evento[]>(7),
                };

                this.calendar.push(item);

                this.index_week = this.calendar.findIndex(
                  (c) => c.days.findIndex((d) => d.isSame(start_week)) > -1
                );

                item.days.map((day, index) => {
                  eventi
                    .filter((x) => {
                      const dateEvent = moment(x.data);

                      return (
                        dateEvent.format(moment.HTML5_FMT.DATE) ==
                        day.format(moment.HTML5_FMT.DATE)
                      );
                    })
                    .map((e) => {
                      if (item.events[index] == undefined) item.events[index] = [];
                      item.events[index].push(e);
                    });
                });
              }
            },
            (err) => console.error(err)
          );
      }
      else {
        this.eventiService
          .getEventiByIntervalDayType(date, this.endDay, this.tipo)
          .subscribe(
            (eventi: Evento[]) => {

              while (date.isBefore(this.endDay, "day")) {
                let item = {
                  days: Array(7)
                    .fill(0)
                    .map(() => date.add(1, "day").clone()),
                  events: Array<Evento[]>(7),
                };

                this.calendar.push(item);

                this.index_week = this.calendar.findIndex(
                  (c) => c.days.findIndex((d) => d.isSame(start_week)) > -1
                );

                item.days.map((day, index) => {
                  eventi
                    .filter((x) => {
                      const dateEvent = moment(x.data);

                      return (
                        dateEvent.format(moment.HTML5_FMT.DATE) ==
                        day.format(moment.HTML5_FMT.DATE)
                      );
                    })
                    .map((e) => {
                      if (item.events[index] == undefined) item.events[index] = [];
                      item.events[index].push(e);
                    });
                });
              }
            },
            (err) => console.error(err)
          );
      }
    }
    else {
      this.loadUser();
      this.turniService
        .getTurniByIntervalDay(date, this.endDay)
        .subscribe(
          (turniMensiliList: Turnimensili[]) => {

            while (date.isBefore(this.endDay, "day")) {
              let item = {
                days: Array(7)
                  .fill(0)
                  .map(() => date.add(1, "day").clone()),
                events: Array<Turnimensili[]>(7),
              };

              this.calendar.push(item);

              this.index_week = this.calendar.findIndex(
                (c) => c.days.findIndex((d) => d.isSame(start_week)) > -1
              );

              item.days.map((day, index) => {
                turniMensiliList
                  .filter((x) => {
                    const dateEvent = moment(x.dataRifInizio);

                    return (
                      dateEvent.format(moment.HTML5_FMT.DATE) ==
                      day.format(moment.HTML5_FMT.DATE)
                    );
                  })
                  .map((e) => {
                    if (item.events[index] == undefined) item.events[index] = [];
                    item.events[index].push(e);
                  });
              });
            }
          },
          (err) => console.error(err)
        );
    }
  }

  ngOnInit() {
    this.turni = this.isTurni;

    this.update_calendar();
  }

  getEvent(calendar: any, index: number) {
    if (calendar !== undefined) {
      var c = calendar.days.map(function (e, i) {
        return [e, calendar.events[i]];
      });

      if (c[index][1] != undefined)
        return c[index][1].sort(
          (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
        );
    }
  }

  showEvent(evento: Evento) {
    //console.log("evento:", evento);
  }


  showturni(item: moment.Moment, calendar_week: any, index: number) {
    var mattina = [];
    var pomeriggio = [];
    var notte = [];
    this.turniService
      .getTurnimensili()
      .subscribe(
        (turniMensiliList: Turnimensili[]) => {
          var i = 0;

          turniMensiliList.filter(x => x.tipoTurno === "Mattina" && this.differenzaInGiorni(new Date(x.dataRifInizio), new Date(item.toDate())) === 0).forEach((x: Turnimensili) => {
            mattina[i] = { user: x.utente, role: x.mansione };
            i++;
          });
          i = 0;
          turniMensiliList.filter(x => x.tipoTurno === "Pomeriggio" && this.differenzaInGiorni(new Date(x.dataRifInizio), new Date(item.toDate())) === 0).forEach((x: Turnimensili) => {
            pomeriggio[i] = { user: x.utente, role: x.mansione };
            i++;
          });
          i = 0;
          turniMensiliList.filter(x => x.tipoTurno === "Notte" && this.differenzaInGiorni(new Date(x.dataRifInizio), new Date(item.toDate())) === 0).forEach((x: Turnimensili) => {
            notte[i] = { user: x.utente, role: x.mansione };
            i++;
          });
          (err) => console.error(err)
        });
    const dialogRef = this.dialog.open(DialogTurniComponent, {
      width: '600px',
      data: {
        table1: mattina,
        table2: pomeriggio,
        table3: notte
      }
    });
  }

  createEvent(item: moment.Moment, calendar_week: any, index: number) {

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
        //console.log("The dialog was closed", result);

        if (result instanceof Object) {
          let index_week = this.calendar.findIndex(
            (c) => c.days.findIndex((d) => d.isSame(item)) > -1
          );
          if (this.calendar[index_week].events[index] == undefined)
            this.calendar[index_week].events[index] = [];

          let evento: Evento = result;
          evento.utente = this.user.identify;
          evento.tipo = this.tipo == "" ? this.user.mansione : this.tipo;

          this.eventiService
            .insertEvento(evento)
            .then((res) => {
              this.calendar[index_week].events[index].push(evento);
            })
            .catch((err) => {
              console.error("Error to insert Events");
              this.messageService.showMessageError(
                "Errore: Inserimento Evento fallito (" + err["status"] + ")"
              );
            });
        }
        if (this.url !== undefined && this.url !== null && this.url != "") {
          window.location.href = this.url;
          window.location.reload();
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

  loadUser() {
    this.authenticationService.getCurrentUserAsync().subscribe(
      (user) => {
        this.dipendenteService
          .getByIdUser(user.dipendenteID)
          .then((x) => {
            this.dipendente = x[0];
          })
          .catch((err) => {
            this.messageService.showMessageError(
              "Errore Caricamento dipendente (" + err["status"] + ")"
            );
          });
      });
  }


  differenzaInGiorni(a: Date, b: Date): number {
    var _MS_PER_ANNO = 1000 * 60 * 60 * 24;
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_ANNO);
  }
}
