import { Component, OnInit } from "@angular/core";
import { MatSelectChange } from "@angular/material";

import { map } from "rxjs/operators";
import { Observable, of } from "rxjs";

import { MapService } from "src/app/service/map.service";
import { CamereService } from "src/app/service/camere.service";
import { Camere } from "src/app/models/camere";
import { Piano } from "src/app/models/piano";

import ImageLayer from "ol/layer/Image";
import Projection from "ol/proj/Projection";
import Static from "ol/source/ImageStatic";
import { getCenter } from "ol/extent";

import Map from "ol/Map";
import View from "ol/View";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import { Geometry, Polygon } from "ol/geom";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import Text from "ol/style/Text";

@Component({
  selector: "app-camere",
  templateUrl: "./camere.component.html",
  styleUrls: ["./camere.component.css"],
})
export class CamereComponent implements OnInit {
  map: Map;
  selectedPiano: string;

  camere: Observable<Camere[]>;
  selectedCamera: Camere;
  //selectedCameraId: string;
  editMode: boolean;

  text = new Text({
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

  cameraStyle =  new Style({
    stroke: new Stroke({
      width: 3,
      color: [0, 0, 255, 1],
    }),
    fill: new Fill({
      color: [0, 255, 0, 0.2],
    })
  });

  pianoList: Observable<Piano[]> = of([
    { code: "1p", description: "Piano Terra"},
    { code: "2p", description: "Primo Piano"},
    { code: "1c", description: "Chiesa - Terra"},
    { code: "2c", description: "Chiesa - Primo"}
  ]);

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

  empty = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [[]],
        },
      },
    ],
  };

  constructor(
    private mapService: MapService,
    private camereService: CamereService
  ) {
    this.selectedPiano = "2p";
    this.editMode = false;
    this.getCamere(this.selectedPiano);
  }

  ngOnInit(): void {
    this.map = this.initMap();

    this.loadLayers();
  }

  initMap() {
    this.pianoTerra = this.mapService.getPrimoPiano();
    this.pianoPrimo = this.mapService.getSecondoPiano();
    this.pianoChiesaTerra = this.mapService.getPrimoChiesa();
    this.pianoChiesaPrimo = this.mapService.getSecondoChiesa();

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

  cameraLayerDebug: VectorLayer<VectorSource<Geometry>>;

  getCamere(piano: string) {
    this.camere = this.camereService.get(piano)
      .pipe(
        map( (x: Camere[])=>
            x.filter(c=> c.forPatient === true).sort((o1, o2)=> o1.order - o2.order)),
        map( (x: Camere[])=>
            x.map( c => {
              return {
                ...c,
                geometryObject: JSON.parse(c.geometry)
              };
            }))
    );
  }

  getCoord(event: any) {
    if (this.editMode) {
      var coordinate = this.map.getEventCoordinate(event);
      const coord = [coordinate[0], coordinate[1]];

      if (this.selectedCamera) {
        this.selectedCamera.geometryObject.features[0].geometry.coordinates[0].push(
          coord
        );
        this.updateLayerCamera();
      }
    }
  }

  getCameraJsonDebug() {
    return this.selectedCamera.geometryObject.features[0].geometry.coordinates;
  }

  updateLayerCamera() {
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(this.selectedCamera.geometryObject),
    });

    this.cameraLayerDebug.setSource(vectorSource);

    const polygon = vectorSource.getFeatures()[0].getGeometry() as Polygon;
    const coordinate = polygon.getCoordinates()[0][0];

    this.text.setText(`${this.selectedCamera.camera}\nN. Posti ${this.selectedCamera.numPostiLiberi}/${this.selectedCamera.numMaxPosti}`);
    this.cameraStyle.setText(this.text);
    this.map.getView().setCenter(coordinate);
  }

  saveForPatientFlag(flag) {
    this.selectedCamera.forPatient = flag;
    this.camereService.update(this.selectedCamera).subscribe((res) => {
      console.log(res);
    });
  }

  saveLayerCamera() {
    this.camereService.update(this.selectedCamera).subscribe((res) => {
      console.log(res);
    });
  }

  deselectCamera() {
    this.selectedCamera = undefined;
    this.cameraLayerDebug.setSource(undefined);
  }

  addCamera() {
    this.selectedCamera = new Camere();
    this.selectedCamera.camera = "Nuova Camera";
    this.selectedCamera.piano = this.selectedPiano;

    this.camereService.add(this.selectedCamera).subscribe((res) => {
      this.selectedCamera = res;
      this.selectedCamera.geometryObject = JSON.parse(
        this.selectedCamera.geometry
      );
      this.getCamere(this.selectedPiano);
      this.updateLayerCamera();
    });
  }

  removeCamera() {
    this.camereService.remove(this.selectedCamera).subscribe((res) => {
      this.getCamere(this.selectedPiano);
      this.deselectCamera();
    });
  }

  removePoint(index: number) {
    this.selectedCamera.geometryObject.features[0].geometry.coordinates[0].splice(
      index,
      1
    );
    this.updateLayerCamera();
  }

  loadLayers() {
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(this.empty),
    });

    this.cameraLayerDebug = new VectorLayer({
      source: vectorSource,
      style: this.cameraStyle
    });

    this.map.addLayer(this.cameraLayerDebug);
  }

  setPlan(plan: string) {
    this.map.getAllLayers().forEach((x) => this.map.removeLayer(x));

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

    this.map.addLayer(this.cameraLayerDebug);
  }

  onPlanChange(event: MatSelectChange) {
    this.setPlan(event.value);
    this.getCamere(event.value as string)
    this.deselectCamera();
  }

  onChangeCamera(event: MatSelectChange) {
    this.selectedCamera = event.value;
    this.updateLayerCamera();
  }
}
