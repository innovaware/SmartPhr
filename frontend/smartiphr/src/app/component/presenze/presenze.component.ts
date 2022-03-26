import { Component, Input, OnChanges, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogMessageErrorComponent } from "src/app/dialogs/dialog-message-error/dialog-message-error.component";
import { Dipendenti } from "src/app/models/dipendenti";
import { Presenze } from "src/app/models/presenze";
import { PresenzeService } from "src/app/service/presenze.service";

@Component({
  selector: "app-presenze",
  templateUrl: "./presenze.component.html",
  styleUrls: ["./presenze.component.css"],
})
export class PresenzeComponent implements OnInit, OnChanges {
  @Input() data: Presenze[];
  @Input() dipendente: Dipendenti;
  @Input() disable: boolean;
  @Input() isExternal: boolean;

  @Output() showItemEmiter = new EventEmitter<{
    presenze: Presenze;
    button: string;
  }>();
  @Input() buttons: string[];
  @Input() showInsert: boolean;

  displayedColumns: string[] = [
    "cognome",
    "nome",
    "data",
    "mansione",
    "inizioturno",
    "fineturno",
    "cf",
    "action",
  ];

  dataSource: MatTableDataSource<Presenze>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  public presenze: Presenze[];

  constructor(
    public presenzeService: PresenzeService
  ) {}

  ngOnChanges(changes) {
    console.log(this.data);

    this.dataSource = new MatTableDataSource<Presenze>(this.data);
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    // if (this.data) {
    //   this.presenzeService
    //     .getPresenzeByDipendente(this.data._id)
    //     .subscribe((result: Presenze[]) => {
    //       this.presenze = result;

    //       this.dataSource = new MatTableDataSource<Presenze>(this.presenze);
    //       this.dataSource.paginator = this.paginator;
    //     });
    // } else {
    //   this.presenzeService.getPresenze().subscribe((result) => {
    //     this.presenze = result;

    //     this.dataSource = new MatTableDataSource<Presenze>(this.presenze);
    //     this.dataSource.paginator = this.paginator;
    //   });
    // }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  call(presenze: Presenze, item: string) {
    this.showItemEmiter.emit({ presenze: presenze, button: item });
  }
}
