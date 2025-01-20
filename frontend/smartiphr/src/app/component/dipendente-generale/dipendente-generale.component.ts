import { Component, Input, OnInit } from '@angular/core';
import { Dipendenti } from 'src/app/models/dipendenti';
import { Output, EventEmitter } from '@angular/core';
import { DipendentiService } from 'src/app/service/dipendenti.service';
import { Mansione } from 'src/app/models/mansione';
import { MansioniService } from 'src/app/service/mansioni.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-dipendente-generale',
  templateUrl: './dipendente-generale.component.html',
  styleUrls: ['./dipendente-generale.component.css']
})
export class DipendenteGeneraleComponent implements OnInit {

  @Input() data: Dipendenti;
  @Input() disable: boolean;
  @Output() dataChange = new EventEmitter<Dipendenti>();
  @Output() saveEmiter = new EventEmitter<Dipendenti>();

  mansioni: Mansione[] = [];

  constructor(
    public mansioniService: MansioniService,
    public dialogRef: MatDialogRef<DipendenteGeneraleComponent>,
    private AuthServ: AuthenticationService,
  )
  {
    dialogRef.disableClose = true;
  }


  ngOnInit() {
    this.mansioniService.get().then((result) => {
     
      if (this.AuthServ.getCurrentUser().role == "66aa1532b6f9db707c1c2010")
        this.mansioni = result;
      else
        this.mansioni = result.filter(x => x._id != "66aa1532b6f9db707c1c2010");
    });
  }

  async save() {
    this.saveEmiter.emit(this.data);
  }

  async change() {
    this.dataChange.emit(this.data);
  }

  async Close() {
    window.location.reload();
  }
}
