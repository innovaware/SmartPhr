import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import * as moment from "moment";
import "moment/locale/it";

@Component({
  selector: "app-slider-date",
  templateUrl: "./slider-date.component.html",
  styleUrls: ["./slider-date.component.css"],
})
export class SliderDateComponent implements OnInit {
  @Output() changeDate = new EventEmitter<moment.Moment>();

  dateSelected: moment.Moment;
  dateNow: moment.Moment;

  constructor() {
    const d = new Date();
    this.dateNow = moment(`${d.getFullYear()}/${d.getMonth() + 1}/1`);
    this.dateSelected = moment(this.dateNow);
    console.log(this.dateSelected);
  }

  getDate() {
    return this.dateSelected.locale("it").format("MMMM YYYY").toUpperCase();
  }

  ngOnInit() {}

  right() {
    if (this.dateSelected < this.dateNow) {
      this.dateSelected = this.dateSelected.add(1, "M");
      this.changeDate.emit(this.dateSelected);
    }
  }

  left() {
    this.dateSelected = this.dateSelected.add(-1, "M");
    this.changeDate.emit(this.dateSelected);
  }
}
