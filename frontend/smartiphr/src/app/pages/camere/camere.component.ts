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
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import { Geometry, Polygon } from "ol/geom";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import { Observable, of } from "rxjs";
import { Piano } from "src/app/models/piano";

@Component({
  selector: "app-camere",
  templateUrl: "./camere.component.html",
  styleUrls: ["./camere.component.css"],
})
export class CamereComponent implements OnInit {
  map: Map;
  selectedPiano: string;

  camere: Camere[];
  selectedCamera: Camere;
  selectedCameraId: string;
  editMode: boolean;

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
    this.selectedPiano = "1p";
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
      layers: [this.pianoTerra.layer],
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

  cameraLayerDebug: VectorLayer<VectorSource<Geometry>>;

  getCamere(piano: string) {
    console.log("Piano", piano);

    this.camereService.get(piano).subscribe((c) => {
      this.camere = c;
    });
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
    this.selectedCameraId = undefined;
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
      this.camere.push(this.selectedCamera);
      this.updateLayerCamera();
    });
  }

  removeCamera() {
    this.camereService.remove(this.selectedCamera).subscribe((res) => {
      const index = this.camere.findIndex(x=> x._id === this.selectedCameraId);
      if (index > -1) {
        this.camere.splice(index, 1);
      }

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
      style: new Style({
        stroke: new Stroke({
          width: 3,
          color: [0, 0, 255, 1],
        }),
        fill: new Fill({
          color: [0, 0, 255, 0.5],
        }),
      }),
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
    this.selectedCamera = this.camere.find((x) => x._id === event.value);
    this.selectedCamera.geometryObject = JSON.parse(
      this.selectedCamera.geometry
    );


    // var aa = this.selectedCamera.geometryObject.getGeometry().getExtent();
    // console.log(aa);

    // var oo = ol.extent.getCenter(aa);

    // this.map.getView().setCenter()
    // view.setCenter(ol.proj.transform([
    //   +centerPosition.lng,
    //   +centerPosition.lat
    // ], 'EPSG:4326', 'EPSG:3857'));
    // view.setZoom(5);


    this.updateLayerCamera();
  }
}
