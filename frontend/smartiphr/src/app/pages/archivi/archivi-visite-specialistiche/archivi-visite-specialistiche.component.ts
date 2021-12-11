import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import * as moment from "moment";
import { map } from "rxjs/operators";
import { DocumentoPaziente } from "src/app/models/documentoPaziente";
import { Paziente } from "src/app/models/paziente";
import { MessagesService } from "src/app/service/messages.service";
import { PazienteService } from "src/app/service/paziente.service";

@Component({
  selector: "app-archivi-visite-specialistiche",
  templateUrl: "./archivi-visite-specialistiche.component.html",
  styleUrls: ["./archivi-visite-specialistiche.component.css"],
})
export class ArchiviVisiteSpecialisticheComponent implements OnInit {
  typeDocument: string = "VisiteSpecialistiche";

  constructor() {}

  ngOnInit() {}
}
