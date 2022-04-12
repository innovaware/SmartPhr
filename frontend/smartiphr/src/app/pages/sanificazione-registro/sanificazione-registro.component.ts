import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-sanificazione-registro',
  templateUrl: './sanificazione-registro.component.html',
  styleUrls: ['./sanificazione-registro.component.css']
})
export class SanificazioneRegistroComponent implements OnInit {
  @ViewChild("paginatorControlliOSS",{static: false}) ControlliOSSPaginator: MatPaginator;
  public registroSanficazioneDataSource: MatTableDataSource<any>;
  DisplayedColumns: string[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
