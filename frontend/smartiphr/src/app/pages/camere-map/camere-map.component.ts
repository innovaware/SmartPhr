import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Observable } from "rxjs";
import { Camere } from "src/app/models/camere";
import { map } from "rxjs/operators";

import ImageLayer from "ol/layer/Image";
import Projection from "ol/proj/Projection";
import Static from "ol/source/ImageStatic";
import { getCenter } from "ol/extent";

import Map from "ol/Map";
import View from "ol/View";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import Text from "ol/style/Text";
import { Color } from "ol/color";
import { MapService } from "src/app/service/map.service";
import { CamereService } from "src/app/service/camere.service";
import { ArmadioService } from "../../service/armadio.service";


@Component({
  selector: "app-camere-map",
  templateUrl: "./camere-map.component.html",
  styleUrls: ["./camere-map.component.css"],
})
export class CamereMapComponent implements OnInit {
  map: Map;

  camere: Observable<Camere[]>;

  pianoPrimo: {
    layer: ImageLayer<Static>;
    extent: number[];
    projection: Projection;
    target: string;
  };

  func: any;
  isSanificazione: boolean = false;
  isArmadi: boolean = false;
  isStagionale: boolean = false;
  isLetti: boolean = false;

  constructor(
    private mapService: MapService,
    private camereService: CamereService,
    private route: ActivatedRoute,
    private armadioService: ArmadioService,
  ) {
    this.route.queryParams.subscribe(params => {
      const func = params.function as string;
      switch (func?.toLowerCase()) {
        case 'sanificazione':
          this.loadCamere('2p');
          this.func = this._getColorSanificataCameraImpl;
          this.isSanificazione = true;
          this.isLetti = false;
          this.isArmadi = false;
          this.isStagionale = false;
          break;
        case 'armadi':
          this.func = this._getColorArmadiCameraImpl;
          this.isArmadi = true;
          this.isLetti = false;
          this.isSanificazione = false;
          this.isStagionale = false;
          break;
        case 'stagionale':
          this.func = this._getColorArmadiStagionaleCameraImpl;
          this.isArmadi = false;
          this.isStagionale = true;
          this.isLetti = false;
          this.isSanificazione = false;
          break;
        case 'libera':
        default:
          this.func = this._getColorLiberaCameraImpl;
          this.isLetti = true;
          this.isArmadi = false;
          this.isSanificazione = false;
          this.isStagionale = false;
          break;
      }
    });


  }

  ngOnInit(): void {
    this.map = this.initMap();

    // this.loadLayers();
    this.loadCamere('2p')

    this.camere.subscribe((cams: Camere[]) => cams.forEach(cam => this.addLayer(cam)));

  }

  loadCamere(piano: string) {
    this.camere = this.camereService.getByPiano(piano)
      .pipe(
        map((x: Camere[]) =>
          x.filter(c => c.forPatient === true).sort((o1, o2) => o1.order - o2.order)),
        map((x: Camere[]) =>
          x.map(c => {
            return {
              ...c,
              geometryObject: JSON.parse(c.geometry)
            };
          }))
      );
  }

  _getColorLiberaCameraImpl(camera: Camere, text: Text, cameraStyle: Style) {
    if (camera.numPostiOccupati == undefined) camera.numPostiOccupati = 0;
    const colorRGB = () => {
      if (camera.numPostiOccupati === 0) return [0, 0, 0, 0.3] as Color;

      return [
        (camera.numMaxPosti - camera.numPostiOccupati) === 0 ? 255 : 0,
        (camera.numMaxPosti - camera.numPostiOccupati) !== 0 ? 255 : 0,
        0,
        0.3
      ];
    };
    text.setText(`${camera.camera}\nN. Posti ${camera.numPostiOccupati}/${camera.numMaxPosti}`);
    text.getFill().setColor([0, 0, 0, 1] as Color);
    cameraStyle.setText(text);


    cameraStyle.setFill(
      new Fill({
        color: colorRGB(), //RGBA
      }));
  }

  _getColorSanificataCameraImpl(camera: Camere, text: Text, cameraStyle: Style) {
    const colorRGB = () => {
      if (camera.sanificata === true) return [0, 255, 0, 0.3] as Color;

      return [255, 0, 0, 0.3] as Color;
    };

    text.setText(`${camera.camera}`);
    text.getFill().setColor([0, 0, 0, 1] as Color);
    cameraStyle.setText(text);


    cameraStyle.setFill(
      new Fill({
        color: colorRGB(), //RGBA
      }));
  }

  _getColorArmadiStagionaleCameraImpl(camera: Camere, text: Text, cameraStyle: Style) {
    let count = 0;
    this.armadioService.getByCamera(camera._id).subscribe((result) => {
      var x = result.filter(y => y.stagionale == true);
      count = x.length;
      const colorRGB = () => {
        if (camera.numPostiOccupati === 0) return [0, 0, 0, 0.3] as Color;
        if (count == 0) return [255, 0, 0, 0.3] as Color;
        if (count == camera.numPostiOccupati) return [0, 255, 0, 0.3] as Color;
        if (count < camera.numPostiOccupati && count > 0) return [255, 255, 0, 0.3] as Color;
      };

      text.setText(`${camera.camera}`);
      text.getFill().setColor([0, 0, 0, 1] as Color);
      cameraStyle.setText(text);

      cameraStyle.setFill(
        new Fill({
          color: colorRGB(), //RGBA
        }));
    });

  }
  _getColorArmadiCameraImpl(camera: Camere, text: Text, cameraStyle: Style) {
    let count = 0;
    this.armadioService.getByCamera(camera._id).subscribe((result) => {
      var x = result.filter(y => y.verified == true);
      count = x.length;
      const colorRGB = () => {
        if (camera.numPostiOccupati === 0) return [0, 0, 0, 0.3] as Color;
        if (count == 0) return [255, 0, 0, 0.3] as Color;
        if (count == camera.numPostiOccupati) return [0, 255, 0, 0.3] as Color;
        if (count < camera.numPostiOccupati && count > 0) return [255, 255, 0, 0.3] as Color;
      };

      text.setText(`${camera.camera}`);
      text.getFill().setColor([0, 0, 0, 1] as Color);
      cameraStyle.setText(text);

      cameraStyle.setFill(
        new Fill({
          color: colorRGB(), //RGBA
        }));
    });

  }


  addLayer(camera: Camere) {
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(camera.geometryObject),
    });

    const text = new Text({
      font: '16px Calibri,sans-serif',
      overflow: true,
      fill: new Fill({
        color: '#f00'
      }),
      stroke: new Stroke({
        color: '#FFF',
        width: 3
      })
    });

    const cameraStyle = new Style({
      stroke: new Stroke({
        width: 3,
        color: [0, 0, 255, 1],
      }),
      fill: new Fill({
        color: [0, 255, 0, 0.2],
      })
    });

    const cameraLayerDebug = new VectorLayer({
      source: vectorSource,
      style: cameraStyle
    });

    // this._getColorLiberaCameraImpl(camera, text, cameraStyle);
    // this._getColorSanificataCameraImpl(camera, text, cameraStyle);
    this.func(camera, text, cameraStyle);

    this.map.addLayer(cameraLayerDebug);
  }

  initMap() {
    this.pianoPrimo = this.mapService.getSecondoPiano();

    return new Map({
      layers: [this.pianoPrimo.layer],
      target: "ol-map",
      view: new View({
        projection: this.pianoPrimo.projection,
        center: getCenter(this.pianoPrimo.extent),
        zoom: 2,
        maxZoom: 8,
      }),
      controls: [],
      // interactions: [],
    });
  }
}
