import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Dipendenti } from 'src/app/models/dipendenti';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { DipendentiService } from 'src/app/service/dipendenti.service';
import { UploadService } from 'src/app/service/upload.service';
import { MessagesService } from '../../service/messages.service';
import { MansioniService } from '../../service/mansioni.service';
import { MatDialog } from '@angular/material/dialog';
import { controllomensile } from '../../models/controllomensile';
import { ControlloMensileService } from '../../service/controllomensile.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-Report-controllo-mensile',
  templateUrl: './Report-controllo-mensile.component.html',
  styleUrls: ['./Report-controllo-mensile.component.css']
})
export class ReportControlloMensileComponent implements OnInit {

  public type: string;
  dipendente: Dipendenti;
  public dataSourceControlloMensile: MatTableDataSource<controllomensile>;
  public ControlloMensile: controllomensile[];
  DisplayedColumns: string[] = ["dataControllo", "utenteNome", "esitoPositivo", "tipo", "note",];
  @ViewChild("paginatorControllo", { static: false }) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public ControlloMensileService: ControlloMensileService,
    public uploadService: UploadService,
    public dipendenteService: DipendentiService,
    public authenticationService: AuthenticationService,
    public messageService: MessagesService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      const func = params.function as string;
      this.type = func?.toLowerCase() === 'infermeria' ? 'Infermeria' :
        func?.toLowerCase() === 'oss' ? 'OSS' : '';
      this.getData(this.type);
    });
  }

  ngOnInit() {
    this.loadUser();
  }

  async loadUser() {
    try {
      const user = await this.authenticationService.getCurrentUserAsync().toPromise();
      const dipendente = await this.dipendenteService.getByIdUser(user.dipendenteID);
      this.dipendente = dipendente[0];
    } catch (err) {
      this.messageService.showMessageError("Errore Caricamento dipendente (" + err["status"] + ")");
    }
  }

  getData(type: string) {
    if (type == "OSS") type = "Riordino Armadi";
    if (type == "Infermeria") type = "Gestione Infermeria";
    this.ControlloMensile = [];
    this.dataSourceControlloMensile = new MatTableDataSource<controllomensile>([]);
    const getDataObservable = type ? this.ControlloMensileService.getByType(type) : this.ControlloMensileService.get();

    getDataObservable.subscribe((result) => {
      this.ControlloMensile = this.sortByDate(result);
      this.dataSourceControlloMensile.data = this.ControlloMensile;
      this.dataSourceControlloMensile.paginator = this.paginator;
    });
  }

  sortByDate(data: controllomensile[]): controllomensile[] {
    return data.sort((a, b) => {
      const dateA = new Date(a.dataControllo).getTime();
      const dateB = new Date(b.dataControllo).getTime();
      return dateB - dateA;
    });
  }
}
