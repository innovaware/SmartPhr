import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MessagesService } from 'src/app/service/messages.service';
import { Dipendenti } from '../../models/dipendenti';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TestRiabilitativoService } from '../../service/testRiabilitativo.service';
import { TestRiabilitativo } from '../../models/testRiabilitativo';

@Component({
  selector: 'app-dialog-test',
  templateUrl: './dialog-test.component.html',
  styleUrls: ['./dialog-test.component.css']
})
export class DialogTestRiabilitativoComponent implements OnInit {
  
  
  tinetti: Number;
  fim: Number;
  barthel: Number;

  constructor(
    private testService: TestRiabilitativoService,
    private messageService: MessagesService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
        pazienteId: String
    }) {
    this.tinetti = 0;
    this.fim = 0;
    this.barthel = 0;
  }


  ngOnInit(): void {
  }

  salva() {
    var test = new TestRiabilitativo();
    test.fim = this.fim;
    test.tinetti = this.tinetti;
    test.barthel = this.barthel;
    test.paziente = this.data.pazienteId;
    console.log(test);
    this.testService.addTestRiabilitativo(test).subscribe();
  }
}
