import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MatPaginator,
  MatTableDataSource,
} from "@angular/material";
import { DialogVisitespecialisticheComponent } from "src/app/dialogs/dialog-visitespecialistiche/dialog-visitespecialistiche.component";
import { Paziente } from "src/app/models/paziente";
import { VisiteSpecialistiche } from "src/app/models/visiteSpecialistiche";
import { CartellaclinicaService } from "src/app/service/cartellaclinica.service";
import { MessagesService } from "src/app/service/messages.service";

@Component({
  selector: "app-visite-specialistiche",
  templateUrl: "./visite-specialistiche.component.html",
  styleUrls: ["./visite-specialistiche.component.css"],
})
export class VisiteSpecialisticheComponent implements OnInit {
  @Input() data: Paziente;
  public visiteSpecialistiche: any[] = [];

  displayedColumns: string[] = ["dataReq", "contenuto", "dataEsec", "action"];

  @ViewChild("paginatorVisiteSpecialistiche")
  visiteSpecialistichePaginator: MatPaginator;
  public visiteSpecialisticheDataSource: MatTableDataSource<VisiteSpecialistiche>;

  constructor(
    public dialogRef: MatDialogRef<VisiteSpecialisticheComponent>,
    public cartellaclinicaService: CartellaclinicaService,
    public ccService: CartellaclinicaService,
    public dialog: MatDialog,
    public messageService: MessagesService
  ) {}

  ngOnInit() {
    this.getList();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.visiteSpecialisticheDataSource.filter = filterValue
      .trim()
      .toLowerCase();
  }

  async getList() {
    console.log(`get visite paziente: ${this.data._id}`);
    this.cartellaclinicaService
      .getVisiteByUser(String(this.data._id))
      .then((f) => {
        //console.log(JSON.stringify(f));

        this.visiteSpecialistiche = f;
        this.visiteSpecialisticheDataSource = new MatTableDataSource<VisiteSpecialistiche>(
          this.visiteSpecialistiche
        );
        this.visiteSpecialisticheDataSource.paginator = this.visiteSpecialistichePaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento visite");
        console.error(err);
      });
  }

  async add() {
    console.log("Show Add visita:", this.data);
    const visitaSpecialistica: VisiteSpecialistiche = {
      user: this.data._id,
      dataReq: undefined,
      contenuto: undefined,
      dataEsec: undefined,
    };

    var dialogRef = this.dialog.open(DialogVisitespecialisticheComponent, {
      data: { visitaSpecialistica, readonly: false },
      width: "600px",
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result: VisiteSpecialistiche) => {
        if (result != null && result != undefined) {
          this.ccService
            .insertVisita(result)
            .then((x) => {
              console.log("Save visitaSpecialistica: ", x);
              this.visiteSpecialistiche.push(result);
              this.visiteSpecialisticheDataSource = new MatTableDataSource<VisiteSpecialistiche>(
                this.visiteSpecialistiche
              );
            })
            .catch((err) => {
              this.messageService.showMessageError(
                "Errore Inserimento visita (" + err["status"] + ")"
              );
            });


        }
      });
  }
}
