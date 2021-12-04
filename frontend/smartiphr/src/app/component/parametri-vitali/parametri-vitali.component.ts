import { Component, Input, OnInit } from "@angular/core";
import { ChartDataSets, ChartType, RadialChartOptions } from "chart.js";
import * as moment from "moment";
import { Label } from "ng2-charts";
import { Subject } from 'rxjs';
import { ParametriVitali } from "src/app/models/parametriVitali";
import { PazienteService } from "src/app/service/paziente.service";

@Component({
  selector: "app-parametri-vitali",
  templateUrl: "./parametri-vitali.component.html",
  styleUrls: ["./parametri-vitali.component.css"],
})
export class ParametriVitaliComponent implements OnInit {
  @Input() id: string; //Id paziente
  @Input() saveEvent: Subject<string>;

  public radarChartType: ChartType = "radar";
  public radarChartLabels: Label[] = ["PA", "TC", "SPO2", "DIURESI", "GLIC"];

  public radarChartOptions: RadialChartOptions = {
    responsive: true,
  };
  public radarChartData: ChartDataSets[] = [];
  public lineChartDataPA: ChartDataSets[] = [];
  public lineChartDataTC: ChartDataSets[] = [];
  public lineChartDataSPO2: ChartDataSets[] = [];
  public lineChartDataDIURSI: ChartDataSets[] = [];
  public lineChartDataGLIC: ChartDataSets[] = [];

  currentDate: moment.Moment;

  public chartOptions = {
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            unit: "day",
            displayFormats: {
              day: "MMM D", // This is the default
            },
          },
        },
      ],
    },
  };

  constructor(public pazienteService: PazienteService) {
    // this.paramVitali = Array.from({ length: 31 }, (v, k) => k + 1).map(
    //   (giorno) => {
    //     return {
    //       gg: giorno,
    //       pa: [
    //         this.getValueRandom(giorno, 8),
    //         this.getValueRandom(giorno, 12),
    //         this.getValueRandom(giorno, 16),
    //         this.getValueRandom(giorno, 20),
    //       ],
    //       tc: [
    //         this.getValueRandom(giorno, 8),
    //         this.getValueRandom(giorno, 11),
    //         this.getValueRandom(giorno, 14),
    //         this.getValueRandom(giorno, 17),
    //         this.getValueRandom(giorno, 20),
    //       ],
    //       spo2: [
    //         this.getValueRandom(giorno, 8),
    //         this.getValueRandom(giorno, 12),
    //         this.getValueRandom(giorno, 16),
    //         this.getValueRandom(giorno, 20),
    //       ],
    //       diurisi: [
    //         this.getValueRandom(giorno, 4),
    //         this.getValueRandom(giorno, 8),
    //         this.getValueRandom(giorno, 12),
    //         this.getValueRandom(giorno, 16),
    //       ],
    //       glic: [
    //         this.getValueRandom(giorno, 4),
    //         this.getValueRandom(giorno, 8),
    //         this.getValueRandom(giorno, 12),
    //         this.getValueRandom(giorno, 16),
    //       ],
    //       annotazioni: "",
    //     };
    //   }
    // );
  }

  loadCharts() {
    this.lineChartDataPA = [{ data: this.getDataFormatted("pa"), label: "PA" }];
    this.lineChartDataTC = [{ data: this.getDataFormatted("tc"), label: "TC" }];
    this.lineChartDataSPO2 = [{ data: this.getDataFormatted("spo2"), label: "SPO2" }];
    this.lineChartDataDIURSI = [{ data: this.getDataFormatted("diurisi"), label: "DIURESI" }];
    this.lineChartDataGLIC = [{ data: this.getDataFormatted("glic"), label: "GLIC" }];

    const pa = this.getDataFormattedRadar("pa");
    const tc = this.getDataFormattedRadar("tc");
    const spo2 = this.getDataFormattedRadar("spo2");
    const diurisi = this.getDataFormattedRadar("diurisi");
    const glic = this.getDataFormattedRadar("glic");

    this.radarChartData = [{ data: [pa.y, tc.y, spo2.y, diurisi.y, glic.y], label: "" }];
  }

  paramVitali: ParametriVitali[];

  ngOnInit() {
    this.currentDate = moment();
    this.loadParametri(this.currentDate);

    if (this.saveEvent != undefined)
    {
      this.saveEvent.subscribe(v => {
        console.log('saveEvent', v);

        this.pazienteService.updateParametriVitali(v, this.paramVitali, this.currentDate).subscribe(
          result=> {
            console.log("Saved parametri vitali successfull");
          },
          err=> {
            console.error("Error to save parameteri vitali. Message: ", err);
          }
        )
      });
    }
  }

  clearData() {
    this.paramVitali = [];
    this.lineChartDataPA = [];
    this.lineChartDataTC = [];
    this.lineChartDataSPO2 = [];
    this.lineChartDataDIURSI = [];
    this.lineChartDataGLIC = [];
    this.radarChartData = [];
  }

  loadParametri(date: moment.Moment) {
    this.clearData();
    const currentDay = parseInt(this.currentDate.format('DD'), 10)
    const currentYear = parseInt(this.currentDate.format('YYYY'), 10)
    const currentMonth = parseInt(this.currentDate.format('MM'), 10)

    const numerDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let gg = 1; gg <= numerDay; gg++) {
      let paramVit: ParametriVitali = new ParametriVitali(date, gg);
      this.paramVitali.push(paramVit);
    }

    this.pazienteService.getParametriVitali(this.id, date).subscribe((arg) => {
      console.log("Get parametri vitali. Result: ", arg);
      const data = arg.sort((a, b)=> a.gg < b.gg ? -1 : 1);
      // this.paramVitali = arg.sort((a, b)=> a.gg < b.gg ? -1 : 1);
      // const lastParam = this.paramVitali[this.paramVitali.length-1];
      // for (let gg = lastParam.gg+1; gg <= currentDay; gg++) {
      //   let paramVit: ParametriVitali = new ParametriVitali(date, gg);
      //   this.paramVitali.push(paramVit);
      // }

      this.paramVitali.filter( i => data.findIndex( v=> v.gg === i.gg) >= 0)
        .forEach(element => {
            element.pa = data.find(e => e.gg === element.gg).pa;
            element.tc = data.find(e => e.gg === element.gg).tc;
            element.glic = data.find(e => e.gg === element.gg).glic;
            element.spo2 = data.find(e => e.gg === element.gg).spo2;
            element.diurisi = data.find(e => e.gg === element.gg).diurisi;
            element.annotazioni = data.find(e => e.gg === element.gg).annotazioni;
          }
      );


      this.loadCharts();
    });
  }

  changeDate(date: moment.Moment) {
    console.log("Change Date: ", date);
    this.currentDate = date;
    this.loadParametri(this.currentDate);
  }

  getDataFormatted(label: string): { x: Date; y: number }[] {

    return this.paramVitali  //.filter(item=> item.gg <= (this.currentDate.day() + 1))
      .map((x) => {
        return {
          giorno: x.gg,
          values: x[label].filter( item=> item.y >= 0),
          label: label.toUpperCase(),
        };
      })
      .map((v) => {
        return v.values;
      })
      .reduce((accumulator, value) => accumulator.concat(value), []);
  }

  getDataFormattedRadar(label: string): { x: Date; y: number } {
    return this.paramVitali
      //.filter(item=> item.gg <= (this.currentDate.day() + 1))
      .map((x) =>
        x[label].reduce((prev, current) => {
          return prev.y > current.y ? prev : current;
        })
      )
      .reduce((prev, current) => {
        return prev.y > current.y ? prev : current;
      });
  }

  checkVisible(date: Date) {
    return date < new Date();
  }

  modifyParam(item: { x: Date; y: number; modify: boolean }) {
    this.paramVitali.forEach((parametroVitale) => {
      parametroVitale.pa.forEach((itemParam) => (itemParam.modify = false));
      parametroVitale.tc.forEach((itemParam) => (itemParam.modify = false));
      parametroVitale.spo2.forEach((itemParam) => (itemParam.modify = false));
      parametroVitale.diurisi.forEach(
        (itemParam) => (itemParam.modify = false)
      );
      parametroVitale.glic.forEach((itemParam) => (itemParam.modify = false));
    });

    if (this.checkVisible(item.x)) item.modify = !item.modify;
  }

  chanceValue(item: { x: Date; y: number; modify: boolean }) {
    item.modify = !item.modify;

    this.loadCharts();
  }
}
