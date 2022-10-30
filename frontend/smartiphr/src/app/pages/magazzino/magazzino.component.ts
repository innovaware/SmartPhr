import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-magazzino',
  templateUrl: './magazzino.component.html',
  styleUrls: ['./magazzino.component.css']
})
export class MagazzinoComponent implements OnInit {
  displayedColumns: string[] = ["nome", "descrizione", "area", "quantita", "giacenza", "conformi", "inuso"];

  constructor() { }

  ngOnInit(): void {
  }

}
