import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
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

  @ViewChild("paginatorVisiteSpecialistiche", {static: false})
  visiteSpecialistichePaginator: MatPaginator;
  public visiteSpecialisticheDataSource: MatTableDataSource<VisiteSpecialistiche>;

  constructor(
    private cdRef: ChangeDetectorRef,
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
        this.visiteSpecialistiche = f;

        // Ricrea la fonte dati in modo che Angular e MatTable rilevino subito la modifica della lunghezza
        this.visiteSpecialisticheDataSource = new MatTableDataSource<VisiteSpecialistiche>(this.visiteSpecialistiche);

        // Collega il paginator
        if (this.visiteSpecialistichePaginator) {
          this.visiteSpecialisticheDataSource.paginator = this.visiteSpecialistichePaginator;
        }

        // Forza la Change Detection di Angular
        this.cdRef.detectChanges();
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento visite");
        console.error(err);
      });
  }


  add() {
    console.log("Show Add visita:", this.data);
    const visitaSpecialistica: VisiteSpecialistiche = {
      user: this.data._id,
      dataReq: undefined,
      contenuto: undefined,
      dataEsec: undefined,
    };

    const dialogRef = this.dialog.open(DialogVisitespecialisticheComponent, {
      data: { visitaSpecialistica, readonly: false },
      width: '95%',
      maxWidth: '800px',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: ['large-dialog', 'scrollable-dialog'],
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("result", result);
      if (result) {
        this.getList();
      }
    });
  }
}
