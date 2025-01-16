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
import { Mansione } from "../../models/mansione";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"],
})
export class CalendarComponent implements OnInit {
  [x: string]: any;
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
  mansione: Mansione;
  isCalendarMonthEnabled: boolean = false;
  isCalendarWeekEnabled: boolean = false;

  weekDays: string[] = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  turni: boolean;
  calendar = [];
  public user: UserInfo;
  utente: User;
  old: Boolean;
  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService,
    public eventiService: EventiService,
    private authenticationService: AuthenticationService,
    public dipendenteService: DipendentiService,
    public mansioniService: MansioniService,
    public turniService: TurnimensiliService,
  ) {
    this.dipendente = new Dipendenti();
    this.mansione = new Mansione();
    this.utente = new User();
    this.isCalendarMonthEnabled = true;
    this.user = { identify: '', mansione: '' };
    this.old = false;

    this.utente = this.authenticationService.getCurrentUser();

    this.dipendenteService.getByIdUser(this.utente.dipendenteID).then((x: Dipendenti) => {
      this.dipendente = x[0];
    });

    this.mansioniService.getById(this.utente.role).then((x: Mansione) => {
      this.mansione = x;
      // Sposta l'assegnazione qui, dopo aver risolto la promessa
      this.user.mansione = this.mansione.descrizione;
    });
    console.log(this.tipo);
    this.user.identify = this.utente.username;
  }



  async update_calendar() {

    // Determina il primo e l'ultimo giorno da visualizzare
    if (this.isCalendarMonthEnabled) {
      this.startDay = this.calendar_day.clone().startOf("month").startOf("week");
      this.endDay = this.calendar_day.clone().endOf("month").endOf("week");
    } else {
      // Per la vista settimanale, usa la settimana corrente
      this.startDay = this.calendar_day.clone().startOf("week");
      this.endDay = this.startDay.clone().endOf("week");
    }
    let date = this.startDay.clone().subtract(1, "day");
    let start_week: moment.Moment = this.calendar_day.clone().startOf("week");
    this.calendar = [];
    if (!this.turni) {
        const eventiObservable = this.tipo ?
          this.eventiService.getEventiByIntervalDayType(date, this.endDay, this.tipo, this.user) :
          this.eventiService.getEventiByIntervalDay(date, this.endDay, this.user);

        eventiObservable.subscribe(
          (eventi: Evento[]) => {
            // Crea le settimane fino alla fine del periodo
            while (date.isBefore(this.endDay, "day")) {
              let week = {
                days: [],
                events: Array<Evento[]>(7)
              };

              // Crea 7 giorni per la settimana corrente
              for (let i = 0; i < 7; i++) {
                let currentDay = date.add(1, "day").clone();
                week.days.push(currentDay);

                // Associa gli eventi al giorno corrente
                const dayEvents = eventi.filter(event =>
                  moment(event.data).isSame(currentDay, "day")
                );

                if (dayEvents.length > 0) {
                  week.events[i] = dayEvents;
                }
              }

              this.calendar.push(week);
            }

            // Trova l'indice della settimana corrente
            this.index_week = this.calendar.findIndex(week =>
              week.days.some(day => day.isSame(start_week, "day"))
            );

            // Se siamo in visualizzazione settimanale, mantieni solo la settimana corrente
            if (!this.isCalendarMonthEnabled) {
              let currentWeek = this.calendar[this.index_week];
              if (currentWeek) {
                this.calendar = [currentWeek];
                this.index_week = 0;
              }
            }
          },
          (err) => console.error(err)
        );
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
    // this.initUser();



    //this.loadUser();

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


  async viewEvents(item: moment.Moment) {
    const data: Date = item.toDate();
    data.setHours(new Date().getHours());

    try {
      // Aspetta il risultato degli eventi
      const items: Evento[] = this.tipo ? await this.eventiService.getEventsByDayType(item, this.tipo, this.user) : await this.eventiService.getEventsByDay(item, this.user).then();
      items.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
      if (item.isBefore(this.today, 'day')) {
        this.old = true;
      } else {
        this.old = false;
      }

      // Apri il dialog dopo aver ottenuto i dati
      const dialogRef = this.dialog.open(DialogEventComponent, {
        data: {
          items: items, // Passa gli eventi ottenuti
          create: false,
          user: this.user,
          tipo: this.tipo,
          old:this.old,
        },
        width: '90%',  // Larghezza del dialog responsiva
        maxWidth: '600px', // Larghezza massima
        height: 'auto', // Altezza automatica
        maxHeight: '90vh' // Altezza massima responsiva
      });


      if (dialogRef) {
        dialogRef.afterClosed().subscribe((result) => {
          // Azioni da eseguire dopo la chiusura del dialog
          console.log('Dialog closed with result:', result);
          this.update_calendar();
        });
      }
    } catch (error) {
      // Gestione degli errori
      console.error('Errore nel recupero degli eventi:', error);
    }
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
      data: {
        item: event,
        create: true
      }
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

  newEvent() {
    var data: Date = moment().toDate();
    data.setHours(new Date().getHours());

    var event: Evento = {
      data: data,
      descrizione: "",
      tipo: "",
      utente: "",
    };

    var dialogRef = this.dialog.open(DialogEventComponent, {
      data: {
        item: event,
        create: true,
      },
    });

    if (dialogRef != undefined) {
      dialogRef.afterClosed().subscribe((result) => {
        if (result instanceof Object && result.data) {
          const item: moment.Moment = moment(result.data);

          let index_week = this.calendar.findIndex(
            (c) => c.days.findIndex((d) => d.isSame(item)) > -1
          );
          console.log("mansione: ", this.mansione);
          let evento: Evento = result;
          evento.utente = this.user?.identify || ""; // Fallback in caso di valore non definito
          evento.tipo = this.tipo?.trim() || this.user?.mansione?.trim() || this.mansione.descrizione; // Valore di default se entrambi sono vuoti o undefined

          console.log("evento: ", evento);

          this.eventiService
            .insertEvento(evento)
            .then((res) => {
              this.update_calendar();
            })
            .catch((err) => {
              console.error("Error to insert Events");
              this.messageService.showMessageError(
                "Errore: Inserimento Evento fallito (" + err["status"] + ")"
              );
            });
        } else {
          console.warn("Dialog result is invalid or undefined:", result);
        }

        if (this.url) {
          window.location.href = this.url;
          window.location.reload();
        }
      });
    }
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
    this.update_calendar();
  }

  async calendarWeek() {
    this.isCalendarMonthEnabled = false;
    this.isCalendarWeekEnabled = true;
    this.update_calendar();
  }

  async loadUser() {
    try {
      const user = await this.authenticationService.getCurrentUser();
      this.user.identify = user.username;
      this.utente = user;
      try {
        const dipendenti = await this.dipendenteService.getByIdUser(user.dipendenteID);
        if (dipendenti) {
          this.dipendente = dipendenti[0];
        } else {
          this.messageService.showMessageError("Nessun dipendente trovato.");
        }
      } catch (err) {
        this.messageService.showMessageError(
          `Errore Caricamento dipendente (${err["status"]})`
        );
      }

      try {
        const mansioni = await this.mansioniService.getById(user.role);
        this.mansione = mansioni;
        this.user.mansione = mansioni.descrizione;
      } catch (err) {
      this.messageService.showMessageError(
        `Errore Caricamento mansione (${err["status"]})`
      );
    }
  } catch(err) {
    this.messageService.showMessageError(
      `Errore durante il caricamento dell'utente (${err["status"]})`
    );
    }
    console.log(this.user);
}



differenzaInGiorni(a: Date, b: Date): number {
  var _MS_PER_ANNO = 1000 * 60 * 60 * 24;
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_ANNO);
}

getEmptyCells(firstDay: any): number[] {
  if (!firstDay) return [];

  // Ottieni il giorno della settimana del primo giorno (0 = domenica, 1 = lunedì, ..., 6 = sabato)
  const dayOfWeek = firstDay.toDate().getDay();

  // Restituisci un array con il numero di celle vuote necessarie
  return Array.from({ length: (dayOfWeek === 0 ? 6 : dayOfWeek - 1) });
}

updateCalendarData(calendar, index_week) {
  const currentWeekDays = calendar[index_week]?.days;

  if (currentWeekDays && currentWeekDays[6]?.isValid() && currentWeekDays[6]?.format('D') === '31') {
    const firstDayOfNextWeek = currentWeekDays[6]?.clone().add(1, 'day');
    const nextWeekDays = [];

    for (let i = 0; i < 7; i++) {
      nextWeekDays.push(firstDayOfNextWeek.clone().add(i, 'day'));
    }

    calendar[index_week + 1] = { days: nextWeekDays };
  }
}

  // Mappa per tenere traccia dell'indice di partenza degli eventi visibili per ogni giorno
  private eventStartIndexMap: Map<string, number> = new Map();

  // Metodo per ottenere la chiave unica per ogni giorno
  private getDayKey(calendarWeek: any, dayIndex: number): string {
  return `${calendarWeek.days[dayIndex].format('YYYY-MM-DD')}`;
}

// Metodo per ottenere gli eventi visibili (massimo 3)
getVisibleEvents(calendarWeek: any, dayIndex: number): any[] {
  const events = this.getEvent(calendarWeek, dayIndex);
  if (!events) return [];

  const dayKey = this.getDayKey(calendarWeek, dayIndex);
  const startIndex = this.eventStartIndexMap.get(dayKey) || 0;

  return events;
}

// Metodo per navigare agli eventi precedenti
navigateEventsPrevious(calendarWeek: any, dayIndex: number, event: Event): void {
  event.stopPropagation();
  const dayKey = this.getDayKey(calendarWeek, dayIndex);
  const currentStart = this.eventStartIndexMap.get(dayKey) || 0;

  if(currentStart > 0) {
  this.eventStartIndexMap.set(dayKey, currentStart - 1);
}
  }

// Metodo per navigare agli eventi successivi
navigateEventsNext(calendarWeek: any, dayIndex: number, event: Event): void {
  event.stopPropagation();
  const events = this.getEvent(calendarWeek, dayIndex);
  if(!events) return;

  const dayKey = this.getDayKey(calendarWeek, dayIndex);
  const currentStart = this.eventStartIndexMap.get(dayKey) || 0;

  if(currentStart + 3 < events.length) {
  this.eventStartIndexMap.set(dayKey, currentStart + 1);
}
  }

// Metodo per controllare se ci sono eventi precedenti
hasPreviousEvents(calendarWeek: any, dayIndex: number): boolean {
  const dayKey = this.getDayKey(calendarWeek, dayIndex);
  const currentStart = this.eventStartIndexMap.get(dayKey) || 0;
  return currentStart > 0;
}

// Metodo per controllare se ci sono eventi successivi
hasNextEvents(calendarWeek: any, dayIndex: number): boolean {
  const events = this.getEvent(calendarWeek, dayIndex);
  if (!events) return false;

  const dayKey = this.getDayKey(calendarWeek, dayIndex);
  const currentStart = this.eventStartIndexMap.get(dayKey) || 0;
  return currentStart + 3 < events.length;
}


}
