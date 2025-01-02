import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { Log, LogList } from "../../models/log";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { Dipendenti } from "../../models/dipendenti";
import { LogService } from "../../service/log.service";
import { AuthenticationService } from "../../service/authentication.service";
import { MansioniService } from "../../service/mansioni.service";
import { DipendentiService } from "../../service/dipendenti.service";
import { MessagesService } from "../../service/messages.service";
import { MatDialog } from "@angular/material/dialog";
import { DialogLogComponent } from "../../dialogs/dialog-log/dialog-log.component";
@Component({
  selector: "app-area-log",
  templateUrl: "./area-log.component.html",
  styleUrls: ["./area-log.component.css"],
})
export class AreaLogComponent implements OnInit, AfterViewInit {

  dataSource: MatTableDataSource<LogList>;
  groupedLogs: LogList[];
  DisplayedColumns: string[] = ["data","numLog","action"];
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  dipendente: Dipendenti;
  sa: Boolean;
  Log: Log[];
  constructor(
    public dialog: MatDialog,
    private LogServ: LogService,
    private DipendentiServ: DipendentiService,
    private AuthServ: AuthenticationService,
    private mansioniServ: MansioniService,
    private messServ: MessagesService
  ) {
    this.dipendente = new Dipendenti();
    this.sa = false;
    this.loadUser();
    this.getDati();
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.getDati();
  }

  viewLog(log: LogList) {
    const dialogRef = this.dialog.open(DialogLogComponent, {
      data: {
        data: log.data,
        logs: log.logList.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      },
      width: "800px",
      height: "550px"
    });

    dialogRef.afterClosed().subscribe(() => {
      
    });

  }

  ngOnInit() {
    
  }

  public inputSearchField;
  cleanSearchField() {
    this.dataSource.filter = undefined;
    this.inputSearchField = undefined;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  loadUser() {
    this.AuthServ.getCurrentUserAsync().subscribe(
      (user) => {

        console.log('get dipendente');
        this.DipendentiServ
          .getByIdUser(user.dipendenteID)
          .then((x) => {
            this.dipendente = x[0];
            this.mansioniServ.getById(this.dipendente.mansione).then((result) => {
              if (result.codice == "SA") {
                this.sa = true;
              }
            });
          })
          .catch((err) => {
            this.messServ.showMessageError(
              "Errore Caricamento dipendente (" + err["status"] + ")"
            );
          });
      });
  }
  getDati() {
    this.Log = [];
    this.groupedLogs = [];
    this.dataSource = new MatTableDataSource<LogList>();

    this.LogServ.getLogs().toPromise().then((res: Log[]) => {
      this.Log = res;

      // Raggruppa i log per data
      const grouped = this.Log.reduce((acc, log) => {
        const logDate = new Date(log.data).toISOString().split('T')[0]; // Trasforma data in oggetto Date
        if (!acc[logDate]) {
          acc[logDate] = [];
        }
        acc[logDate].push(log);
        return acc;
      }, {} as { [key: string]: Log[] });

      // Trasforma in array di LogList
      this.groupedLogs = Object.entries(grouped).map(([date, logs]) => ({
        data: new Date(date),
        logList: logs
      }));

      // Imposta la sorgente dati per la tabella
      this.dataSource.data = this.groupedLogs.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
      this.dataSource.paginator = this.paginator;
    }).catch(error => {
      console.error('Errore nel caricamento dei log:', error);
    });
  }

}
