import { Component, Input, OnInit } from "@angular/core";
import { ChartDataSets, ChartType, RadialChartOptions } from "chart.js";
import { Label } from "ng2-charts";

@Component({
  selector: "app-parametri-vitali",
  templateUrl: "./parametri-vitali.component.html",
  styleUrls: ["./parametri-vitali.component.css"],
})
export class ParametriVitaliComponent implements OnInit {
  @Input() id: string; //Id paziente

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

  constructor() {
    this.paramVitali = Array.from({ length: 30 }, (v, k) => k + 1).map(
      (giorno) => {
        return {
          gg: giorno,
          pa: [
            this.getValueRandom(giorno, 4),
            this.getValueRandom(giorno, 8),
            this.getValueRandom(giorno, 12),
            this.getValueRandom(giorno, 16),
          ],
          tc: [
            this.getValueRandom(giorno, 4),
            this.getValueRandom(giorno, 8),
            this.getValueRandom(giorno, 12),
            this.getValueRandom(giorno, 16),
            this.getValueRandom(giorno, 18),
          ],
          spo2: [
            this.getValueRandom(giorno, 4),
            this.getValueRandom(giorno, 8),
            this.getValueRandom(giorno, 12),
            this.getValueRandom(giorno, 16),
          ],
          diurisi: [
            this.getValueRandom(giorno, 4),
            this.getValueRandom(giorno, 8),
            this.getValueRandom(giorno, 12),
            this.getValueRandom(giorno, 16),
          ],
          glic: [
            this.getValueRandom(giorno, 4),
            this.getValueRandom(giorno, 8),
            this.getValueRandom(giorno, 12),
            this.getValueRandom(giorno, 16),
          ],
          annotazioni: "",
        };
      }
    );


  }

  loadCharts() {
    this.lineChartDataPA = [
      { data: this.getDataFormatted("pa"), label: "PA" },
      // { data: this.getDataFormatted("tc"), label: "TC" },
      // { data: this.getDataFormatted("spo2"), label: "SPO2" },
      // { data: this.getDataFormatted("diurisi"), label: "DIURESI" },
      // { data: this.getDataFormatted("glic"), label: "GLIC" },
    ];

    this.lineChartDataTC = [{ data: this.getDataFormatted("tc"), label: "TC" }];

    this.lineChartDataSPO2 = [
      { data: this.getDataFormatted("spo2"), label: "SPO2" },
    ];

    this.lineChartDataDIURSI = [
      { data: this.getDataFormatted("diurisi"), label: "DIURESI" },
    ];

    this.lineChartDataGLIC = [
      { data: this.getDataFormatted("glic"), label: "GLIC" },
    ];

    const pa = this.getDataFormattedRadar("pa");
    const tc = this.getDataFormattedRadar("tc");
    const spo2 = this.getDataFormattedRadar("spo2");
    const diurisi = this.getDataFormattedRadar("diurisi");
    const glic = this.getDataFormattedRadar("glic");

    this.radarChartData = [
      { data: [pa.y, tc.y, spo2.y, diurisi.y, glic.y], label: "" },
    ];
  }

  paramVitali: {
    gg: number;
    pa: { x: Date; y: number; modify: boolean }[];
    tc: { x: Date; y: number; modify: boolean }[];
    spo2: { x: Date; y: number; modify: boolean }[];
    diurisi: { x: Date; y: number; modify: boolean }[];
    glic: { x: Date; y: number; modify: boolean }[];
    annotazioni: string;
  }[];

  ngOnInit() {}

  getValueRandom(giorno: number, hour: number): { x: Date; y: number, modify: boolean } {
    const max = 40;
    const min = 35;
    // return Math.floor(Math.random() * (max - min + 1) + min);
    let date = new Date("2021-11-" + giorno);
    date.setHours(hour);

    return {
      x: date,
      y: Math.floor(Math.random() * (max - min + 1) + min),
      modify: false
    };
  }

  randomDate(start, end, startHour, endHour) {
    var date = new Date(+start + Math.random() * (end - start));
    var hour = (startHour + Math.random() * (endHour - startHour)) | 0;
    date.setHours(hour);
    return date;
  }

  getDataFormatted(label: string): { x: Date; y: number }[] {
    return this.paramVitali
      .map((x) => {
        return {
          giorno: x.gg,
          values: x[label],
          label: label.toUpperCase(),
        };
      })
      .map((v) => {
        return v.values;
      })
      .reduce((accumulator, value) => accumulator.concat(value), []);

    // arr.reduce((acc, val) => acc.concat(val), []);
  }

  getDataFormattedRadar(label: string): { x: Date; y: number } {
    return this.paramVitali
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


    this.paramVitali.forEach( parametroVitale => {
      parametroVitale.pa.forEach( itemParam => itemParam.modify = false);
      parametroVitale.tc.forEach( itemParam => itemParam.modify = false);
      parametroVitale.spo2.forEach( itemParam => itemParam.modify = false);
      parametroVitale.diurisi.forEach( itemParam => itemParam.modify = false);
      parametroVitale.glic.forEach( itemParam => itemParam.modify = false);
    } );

    if (this.checkVisible(item.x))
      item.modify = !item.modify;
  }

  chanceValue(item: { x: Date; y: number; modify: boolean; }) {
    item.modify = !item.modify;

    this.loadCharts();
  }
}
