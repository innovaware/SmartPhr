import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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
