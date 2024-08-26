import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Evento } from 'src/app/models/evento';
import { MessagesService } from '../../service/messages.service';

@Component({
  selector: 'app-dialog-event',
  templateUrl: './dialog-event.component.html',
  styleUrls: ['./dialog-event.component.css']
})
export class DialogEventComponent implements OnInit {
  @Input() disable: boolean = false;  // Inizializzazione con valori di default
  @Input() isNew: boolean = true;  // Inizializzazione con valori di default
  time: string;  // Usa stringa per l'input di tempo
  visible: Boolean;

  constructor(
    private messageServ: MessagesService,
    public dialogRef: MatDialogRef<DialogEventComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Evento
  ) {
    console.log("item: ", item);
    this.visible = false;
  }

  ngOnInit() {
    if (!this.item) {
      this.item = new Evento(); // Assicurati che l'item non sia undefined
    }
    // Inizializza la variabile time se l'item esiste
    if (this.item.data) {
      const hours = this.item.data.getHours().toString().padStart(2, '0');
      const minutes = this.item.data.getMinutes().toString().padStart(2, '0');
      this.time = `${hours}:${minutes}`;
    }
  }

  save() {
    if (this.item.descrizione == undefined || this.item.descrizione == null || this.item.descrizione == "") {
      this.messageServ.showMessageError("Inserire la descrizione");
      return;
    }
    const [hours, minutes] = this.time.split(':').map(Number);
    this.item.data.setHours(hours);
    this.item.data.setMinutes(minutes);
    this.item.visibile = this.visible;
    this.dialogRef.close(this.item);
  }
}
