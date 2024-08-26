import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MenuGeneraleView } from 'src/app/models/MenuGeneraleView';
import { CucinaService } from 'src/app/service/cucina.service';

@Component({
  selector: 'app-dialog-menu-generale',
  templateUrl: './dialog-menu-generale.component.html',
  styleUrls: ['./dialog-menu-generale.component.css']
})
export class DialogMenuGeneraleComponent implements OnInit {

  arrayWeek: MenuGeneraleView[];
  constructor(
    private cucinaService: CucinaService,
    public dialogRef: MatDialogRef<DialogMenuGeneraleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MenuGeneraleView
  ) {
    this.arrayWeek = [];
  }

  ngOnInit(): void {

    this.cucinaService.getMenuGenerale(this.data.type, this.data.week, this.data.dataStartRif.getFullYear() )
        .subscribe( (menuGenerale: MenuGeneraleView[]) => {
            for (let index = 0; index < 7; index++) {
              let data = menuGenerale.find(x=>
                                           x.week === this.data.week &&
                                           x.year === this.data.dataStartRif.getFullYear() &&
                                           x.day === index)
              if (!data) {
                data = {
                  _id: undefined,
                  type: this.data.type,
                  week: this.data.week,
                  day: index,
                  year: this.data.dataStartRif.getFullYear(),
                  dataStartRif: this.data.dataStartRif,
                  dataEndRif: this.data.dataEndRif,
                  dataInsert: this.data.dataInsert,
                  isNew: true
                }
              }

              this.arrayWeek.push({
                _id: data._id,
                type: data.type,
                week: data.week,
                day: data.day,
                year: new Date(data.dataStartRif).getFullYear(),
                dataStartRif: new Date(data.dataStartRif),
                dataEndRif: new Date(data.dataEndRif),
                dataInsert: new Date(data.dataInsert),

                colazione: data.colazione,
                merenda: data.merenda,
                pranzo: data.pranzo,
                spuntino: data.spuntino,
                cena: data.cena
              });
            }
        });
  }

  getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }


  dateFilter: (date: Date | null) => boolean =
    (date: Date | null) => {
      const day = date.getDay();
      return day === 0;
  }


  save() {
    this.arrayWeek.forEach( date=> {
      if (date.isNew || !date._id) {
        this.cucinaService.addMenuGenerale(date).subscribe(
          res=> {
            this.dialogRef.close(undefined);
          },
          err=> {
            console.error("Error inserimento menu generale", err);
          })
      }
      else {
        this.cucinaService.updateMenuGenerale(date).subscribe(
          res=> {
            this.dialogRef.close(undefined);
          },
          err=> {
            console.error("Error aggiornamento menu generale", err);
          })

      }
      });
  }
  cancel() {
    this.dialogRef.close(undefined);
  }
}
