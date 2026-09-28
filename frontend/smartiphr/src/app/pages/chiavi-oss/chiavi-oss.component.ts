import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { gestChiavi } from 'src/app/models/gestChiavi';
import { Dipendenti } from 'src/app/models/dipendenti';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { DipendentiService } from 'src/app/service/dipendenti.service';
import { MessagesService } from 'src/app/service/messages.service';
import { GestChiaviService } from 'src/app/service/gest-chiavi.service';

@Component({
  selector: 'app-chiavi-oss',
  templateUrl: './chiavi-oss.component.html',
  styleUrls: ['./chiavi-oss.component.css']
})
export class ChiaviOssComponent implements OnInit {

  @ViewChild('paginatorRecordChiavi') set paginator(mp: MatPaginator) {
    this.recordChiaviPaginator = mp;
    if (this.recordChiaviDataSource) {
      this.recordChiaviDataSource.paginator = this.recordChiaviPaginator;
    }
  }

  recordChiaviPaginator!: MatPaginator;
  public nuovoRecordChiavi!: gestChiavi;
  public recordChiaviDataSource = new MatTableDataSource<gestChiavi>([]);
  public recordsChiavi: gestChiavi[] = [];
  public uploadingRecordChiavi = false;
  public addingRecordChiavi = false;

  utente: User = {} as User;
  dipendente: Dipendenti = {} as Dipendenti;

  displayedColumns: string[] = [
    'n_mazzi',
    'operatorPrelievo',
    'datePrelievo',
    'operatorRiconsegna',
    'dateRiconsegna',
    'action'
  ];

  constructor(
    public gestChiaviService: GestChiaviService,
    public dipendenteService: DipendentiService,
    public authenticationService: AuthenticationService,
    public messageService: MessagesService
  ) { }

  ngOnInit(): void {
    this.loadUser();
    this.getLista();
  }

  loadUser(): void {
    this.authenticationService.getCurrentUserAsync().subscribe({
      next: (user) => {
        if (user) {
          this.utente = user;
          if (user.dipendenteID) {
            this.dipendenteService
              .getByIdUser(user.dipendenteID)
              .then((x) => {
                if (x) {
                  this.dipendente = x;
                }
              })
              .catch((err) => {
                this.messageService.showMessageError(
                  'Errore Caricamento dipendente (' + err['status'] + ')'
                );
              });
          }
        }
      },
      error: (err) => console.error('Errore get user:', err)
    });
  }

  /**
   * Helper per ricavare il nome e cognome o la firma dell'operatore in modo sicuro.
   */
  private getDipendenteFullName(): string {
    if (this.dipendente && (this.dipendente.nome || this.dipendente.cognome)) {
      const nome = this.dipendente.nome || '';
      const cognome = this.dipendente.cognome || '';
      return `${nome} ${cognome}`.trim();
    }
    // Fallback se l'oggetto dipendente non è ancora pronto o manca di campi
    if (this.utente && this.utente.firma.valueOf()) {
      return this.utente.firma.valueOf();
    }
    return 'Operatore sconosciuto';
  }

  addRecordChiavi(): void {
    const nomeOperatore = this.getDipendenteFullName();

    this.addingRecordChiavi = true;
    this.nuovoRecordChiavi = {
      operatorPrelievo: this.dipendente._id || this.utente._id,
      operatorPrelievoName: nomeOperatore,
      dataPrelievo: new Date(),
      chiave: 0
    } as gestChiavi;
  }

  async save(rec: gestChiavi): Promise<void> {
    if (!rec.chiave) {
      this.messageService.showMessageError('Inserire un numero mazzo valido');
      return;
    }

    // Assicuriamo che i campi operatore e data siano popolati prima del salvataggio
    rec.operatorPrelievo = this.dipendente._id || this.utente._id;
    rec.operatorPrelievoName = this.getDipendenteFullName();
    rec.dataPrelievo = new Date();

    this.uploadingRecordChiavi = true;
    console.log('Prelievo Chiave : ', rec);

    this.gestChiaviService
      .insert(rec)
      .then((result: gestChiavi) => {
        console.log('Insert gestChiavi: ', result);
        this.recordsChiavi.push(result);
        this.recordChiaviDataSource.data = [...this.recordsChiavi];
        this.addingRecordChiavi = false;
      })
      .catch((err) => {
        this.messageService.showMessageError('Errore Inserimento gestChiavi');
        console.error(err);
      })
      .finally(() => {
        this.uploadingRecordChiavi = false;
      });
  }

  async getLista(): Promise<void> {
    console.log('get Lista');
    this.gestChiaviService
      .get()
      .then((f: gestChiavi[]) => {
        this.recordsChiavi = f || [];
        this.recordChiaviDataSource.data = this.recordsChiavi;
        if (this.recordChiaviPaginator) {
          this.recordChiaviDataSource.paginator = this.recordChiaviPaginator;
        }
      })
      .catch((err) => {
        this.messageService.showMessageError(
          'Errore caricamento lista gestChiavi'
        );
        console.error(err);
      });
  }

  async riconsegna(rec: gestChiavi): Promise<void> {
    if (confirm('Confermi Riconsegna Chiave?')) {
      rec.operatorRiconsegna = this.dipendente._id || this.utente._id;
      rec.operatorRiconsegnaName = this.getDipendenteFullName();
      rec.dataRiconsegna = new Date();

      console.log('Riconsegna Chiave : ', rec._id, 'da:', rec.operatorRiconsegnaName);

      this.gestChiaviService
        .update(rec)
        .then(() => {
          const index = this.recordsChiavi.findIndex(item => item._id === rec._id);
          if (index !== -1) {
            this.recordsChiavi[index] = { ...rec };
            this.recordChiaviDataSource.data = [...this.recordsChiavi];
          }
        })
        .catch((err) => {
          this.messageService.showMessageError('Errore Riconsegna gestChiavi');
          console.error(err);
        });
    }
  }
}
