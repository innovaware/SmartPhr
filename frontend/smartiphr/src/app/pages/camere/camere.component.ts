import { Component, OnInit } from "@angular/core";
import ImageLayer from "ol/layer/Image";
import Projection from "ol/proj/Projection";
import Static from "ol/source/ImageStatic";
import { getCenter } from "ol/extent";

import Map from "ol/Map";
import View from "ol/View";
import { MapService } from "src/app/service/map.service";
import { CamereService } from "src/app/service/camere.service";
import { Camere } from "src/app/models/camere";
import { MatSelectChange } from "@angular/material";

@Component({
  selector: "app-camere",
  templateUrl: "./camere.component.html",
  styleUrls: ["./camere.component.css"],
})
export class CamereComponent implements OnInit {
  map: Map;
  selectedPiano: string;

  camere: Camere[];

  pianoTerra: {
    layer: ImageLayer<Static>;
    extent: number[];
    projection: Projection;
    target: string;
  };

  pianoPrimo: {
    layer: ImageLayer<Static>;
    extent: number[];
    projection: Projection;
    target: string;
  };

  pianoChiesaTerra: {
    layer: ImageLayer<Static>;
    extent: number[];
    projection: Projection;
    target: string;
  };

  pianoChiesaPrimo: {
    layer: ImageLayer<Static>;
    extent: number[];
    projection: Projection;
    target: string;
  };


  constructor(
    private mapService: MapService,
    private camereService: CamereService
  ) {
    this.camereService.get().subscribe((c) => {
      this.camere = c;
    });
  }

  ngOnInit(): void {
    this.selectedPiano = "1p";
    this.map = this.initMap();
  }

  initMap() {
    this.pianoTerra = this.mapService.getPrimoPiano();
    this.pianoPrimo = this.mapService.getSecondoPiano();
    this.pianoChiesaTerra = this.mapService.getPrimoChiesa();
    this.pianoChiesaPrimo = this.mapService.getSecondoChiesa();

    return new Map({
      layers: [
        this.pianoTerra.layer
      ],
      target: "ol-map",
      view: new View({
        projection: this.pianoTerra.projection,
        center: getCenter(this.pianoTerra.extent),
        zoom: 2,
        maxZoom: 8,
      }),
      controls: [],
      // interactions: [],
    });
  }

  setPlan(plan: string) {

    this.map.removeLayer(this.map.getAllLayers()[0]);
    switch (plan) {
      case "2p":
        this.map.addLayer(this.pianoPrimo.layer);
        break;
      case "1c":
        this.map.addLayer(this.pianoChiesaTerra.layer);
        break;
      case "2c":
        this.map.addLayer(this.pianoChiesaPrimo.layer);
        break;

      case "1p":
      default:
        this.map.addLayer(this.pianoTerra.layer);
        break;
    }
  }

  onPlanChange(event: MatSelectChange) {
    const piano = this.setPlan(event.value);
  }
}
