import { Component, OnInit } from "@angular/core";
import ImageLayer from "ol/layer/Image";
import Projection from "ol/proj/Projection";
import Static from "ol/source/ImageStatic";
import { getCenter } from "ol/extent";

import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { MapService } from "src/app/service/map.service";
import { CamereService } from "src/app/service/camere.service";
import { Camere } from "src/app/models/camere";

@Component({
  selector: "app-camere",
  templateUrl: "./camere.component.html",
  styleUrls: ["./camere.component.css"],
})
export class CamereComponent implements OnInit {
  map: Map;
  camere: Camere[];

  constructor(
    private mapService: MapService,
    private camereService: CamereService
    ) {
      this.camereService.get().subscribe( c=> {
          this.camere = c;
      });
    }

  ngOnInit(): void {
    const piano = this.mapService.getPrimoPiano();

    this.map = new Map({
      layers: [piano.layer],
      target: "ol-map",
      view: new View({
        projection: piano.projection,
        center: getCenter(piano.extent),
        zoom: 2,
        maxZoom: 8,
      }),
    });
    //this.map.removeControl(Control.PanZoom)
  }
}
