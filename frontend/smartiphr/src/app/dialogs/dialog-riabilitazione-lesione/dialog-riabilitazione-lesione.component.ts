import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AreaRiabilitativaLesioni } from 'src/app/models/AreaRiabilitativaLesioni';
import { MessagesService } from 'src/app/service/messages.service';

@Component({
  selector: 'app-dialog-riabilitazione-lesione',
  templateUrl: './dialog-riabilitazione-lesione.component.html',
  styleUrls: ['./dialog-riabilitazione-lesione.component.css']
})
export class DialogRiabilitazioneLesioneComponent implements OnInit {

  constructor(
    public messageService: MessagesService,
    public dialogRef: MatDialogRef<DialogRiabilitazioneLesioneComponent>,
    @Inject(MAT_DIALOG_DATA) public lesione: AreaRiabilitativaLesioni
  ) { }

  ngOnInit() {
  }

  save() {
    if ((this.lesione.parteCorpo == "" || this.lesione.parteCorpo == undefined ) &&
        (this.lesione.tipologia == "" || this.lesione.tipologia == undefined)) {
          this.messageService.showMessageError("Tipologia o parte del corpo non sono state definite.");
          console.error("The lesioni compoment not valid");

        }
    else {
      this.dialogRef.close(this.lesione);
    }
  }

}
