import { Component, Input, OnChanges, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Dipendenti } from "src/app/models/dipendenti";
import { DipendentiService } from "src/app/service/dipendenti.service";
import { MessagesService } from "src/app/service/messages.service";
import { DocumentoDipendente } from "../../models/documentoDipendente";
import { Contratto } from "../../models/contratto";
import { ContrattoService } from "../../service/contratto.service";
import { UploadService } from "../../service/upload.service";

@Component({
  selector: "app-contratto-consulenti",
  templateUrl: "./contratto-consulenti.component.html",
  styleUrls: ["./contratto-consulenti.component.css"],
})
export class ContrattoConsulentiComponent implements OnInit, OnChanges {
  @Input() data: Dipendenti;

  @Input() buttons: string[];
  @Input() showInsert: boolean;

  DisplayedColumns1: string[] = ["namefile", "dateInizio", "note", "action"];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  public contratto: Contratto;
  dataSource: MatTableDataSource<Contratto>;
  public contratti: Contratto[];
  @ViewChild("paginatorContratto", { static: false })
  Paginator: MatPaginator;
  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService,
    public contrattoService: ContrattoService,
    public dipendenteService: DipendentiService,
    public uploadService: UploadService
  )
  {
    this.contratti = [];
    //this.dataSource = new MatTableDataSource<Contratto>(this.contratti);
  }

  ngOnChanges(changes) {
    this.contratti = [];
    this.getContratto();
  }

  ngOnInit() {

    this.getContratto();
    this.dataSource = new MatTableDataSource<Contratto>(this.contratti);
    this.dataSource.paginator = this.Paginator;
    console.log("In on Init: ",this.contratti);
  }

  ngAfterViewInit() { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async getContratto() {
    console.log("Chiamato getContratto()"); // Aggiunto per il debugging
    try {
      const f: Contratto[] = await this.contrattoService.getAll();
      console.log("Contratti:", f);
      this.contratti = f;
      this.dataSource.data = this.contratti;
      this.dataSource.paginator = this.Paginator;
    } catch (err) {
      this.messageService.showMessageError("Errore caricamento lista contratto");
      console.error(err);
    }
  }


  async showContratto(contratto: Contratto) {
    this.uploadService
      .download(contratto.filename, contratto.idConsulente, 'contratti')
      .then((x) => {
        
        x.subscribe((data) => {
          
          const newBlob = new Blob([data as BlobPart], {
            type: "application/pdf",
          });

          // IE doesn't allow using a blob object directly as link href
          // instead it is necessary to use msSaveOrOpenBlob
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
          }

          // For other browsers:
          // Create a link pointing to the ObjectURL containing the blob.
          const downloadURL = URL.createObjectURL(newBlob);
          window.open(downloadURL);
        });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento file");
        console.error(err);
      });
  }
}
