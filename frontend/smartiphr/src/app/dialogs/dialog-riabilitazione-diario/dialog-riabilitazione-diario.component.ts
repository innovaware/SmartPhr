import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AreaRiabilitativaDiario } from 'src/app/models/AreaRiabilitativaDiario';
import { MessagesService } from 'src/app/service/messages.service';

@Component({
  selector: 'app-dialog-riabilitazione-diario',
  templateUrl: './dialog-riabilitazione-diario.component.html',
  styleUrls: ['./dialog-riabilitazione-diario.component.css']
})
export class DialogRiabilitazioneDiarioComponent implements OnInit {

  constructor(
    public messageService: MessagesService,
    public dialogRef: MatDialogRef<DialogRiabilitazioneDiarioComponent>,
    @Inject(MAT_DIALOG_DATA) public diario: AreaRiabilitativaDiario
  ) { }

  ngOnInit() {
  }


  save() {
     const num:Number = 0;
    if ((this.diario.controllo == undefined || this.diario.controllo <= num ) ||
        (this.diario.note == "" || this.diario.note == undefined) ||
        (this.diario.firma == "" || this.diario.firma == undefined)) {
          this.messageService.showMessageError("Compila tutti i campi.");
          console.error("Fields compoment not valid");
        }
    else {
      this.dialogRef.close(this.diario);
    }
  }
}
