import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ArmadioService } from 'src/app/service/armadio.service';
import { MessagesService } from 'src/app/service/messages.service';
import { Armadio } from 'src/app/models/armadio';

@Component({
  selector: 'app-dialog-verifica-armadio',
  templateUrl: './dialog-verifica-armadio.component.html',
  styleUrls: ['./dialog-verifica-armadio.component.css']
})
export class DialogVerificaArmadioComponent implements OnInit {
  currentArmadio: Armadio;
  note: string;
  stagionale: Boolean;
  constructor(
    private armadioService: ArmadioService,
    private messageService: MessagesService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      armadio: Armadio
    }) {
    this.currentArmadio = data.armadio;
    this.note = "";
    this.stagionale = false;
  }
  ngOnInit(): void {
  }
  verifica() {
    this.currentArmadio.verified = true;
    this.currentArmadio.stagionale = this.stagionale;
    this.armadioService.update(this.currentArmadio, this.note).subscribe(result => {
      this.messageService.showMessageError("Verifica effettuata");
    });
  }

}
