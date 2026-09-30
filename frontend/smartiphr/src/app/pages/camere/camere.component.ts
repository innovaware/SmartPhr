import { Component, OnInit } from "@angular/core";
import { MatSelectChange } from "@angular/material/select";

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
import { ActivatedRoute } from "@angular/router";
import { Color } from "ol/color";
import { MessagesService } from "../../service/messages.service";

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

  cameraStyle = new Style({
    stroke: new Stroke({
      width: 3,
      color: [0, 0, 255, 1],
    }),
    fill: new Fill({
      color: [0, 255, 0, 0.2],
    })
  });

  pianoList: Observable<Piano[]> = of([
    { code: "1p", description: "Piano Terra" },
    { code: "2p", description: "Primo Piano" },
    { code: "1c", description: "Chiesa - Terra" },
    { code: "2c", description: "Chiesa - Primo" }
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

  cameraLayerDebug: VectorLayer<VectorSource<Geometry>>;

  constructor(
    private mapService: MapService,
    private camereService: CamereService,
    private route: ActivatedRoute,
    private messageService: MessagesService
  ) {
    this.selectedPiano = "2p";
    this.editMode = false;
  }

  ngOnInit() {
    this.map = this.initMap();
    this.loadLayers();
    this.refresh();

    this.route.queryParams.subscribe(params => {
      const idCamera = params.camera as string;

      if (idCamera !== undefined) {
        this.camereService.get(idCamera)
          .subscribe((camera: Camere) => {
            if (camera !== undefined) {
              camera.geometryObject = JSON.parse(camera.geometry);
              this.selectedCamera = camera;
              this.selectedPiano = camera.piano;
              this.refresh();
              this.updateLayerCamera();
            }
          });
      }
    });
  }

  refresh() {
    this.getCamere(this.selectedPiano);
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
    });
  }

  getCamere(piano: string) {
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

  // CORREZIONE 1: Aggiornato calcolo coordinate e refresh dimensione mappa
  getCoord(event: any) {
    if (this.editMode && this.selectedCamera) {
      // Assicura che la mappa sia aggiornata dimensionalmente prima di estrarre le coordinate dal click
      this.map.updateSize();

      var coordinate = this.map.getEventCoordinate(event);

      if (coordinate) {
        const coord = [coordinate[0], coordinate[1]];

        // Inizializza l'albero delle coordinate se non ancora definito
        if (!this.selectedCamera.geometryObject || !this.selectedCamera.geometryObject.features) {
          this.selectedCamera.geometryObject = JSON.parse(JSON.stringify(this.empty));
        }

        if (!this.selectedCamera.geometryObject.features[0].geometry.coordinates[0]) {
          this.selectedCamera.geometryObject.features[0].geometry.coordinates[0] = [];
        }

        this.selectedCamera.geometryObject.features[0].geometry.coordinates[0].push(coord);
        this.updateLayerCamera();
      }
    }
  }

  // CORREZIONE 2: Gestione sicura del poligono vuoto per evitare eccezioni JS
  updateLayerCamera() {
    if (!this.selectedCamera || !this.selectedCamera.geometryObject) {
      return;
    }

    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(this.selectedCamera.geometryObject),
    });

    this.cameraLayerDebug.setSource(vectorSource);

    const features = vectorSource.getFeatures();
    if (features.length > 0) {
      const polygon = features[0].getGeometry() as Polygon;
      const coords = polygon ? polygon.getCoordinates() : null;

      // Centra sulla prima coordinata solo se esiste
      if (coords && coords[0] && coords[0].length > 0) {
        const firstCoordinate = coords[0][0];
        this.map.getView().setCenter(firstCoordinate);
      }
    }

    this.text.setText(`${this.selectedCamera.camera}\nN. Posti ${this.selectedCamera.numPostiOccupati || 0}/${this.selectedCamera.numMaxPosti || 0}`);
    this.cameraStyle.setText(this.text);

    const colorRGB = () => {
      if (!this.selectedCamera.numPostiOccupati || this.selectedCamera.numPostiOccupati === 0) return [0, 0, 0, 0.3] as Color;

      return [
        (this.selectedCamera.numMaxPosti - this.selectedCamera.numPostiOccupati) === 0 ? 255 : 0,
        (this.selectedCamera.numMaxPosti - this.selectedCamera.numPostiOccupati) !== 0 ? 255 : 0,
        0,
        0.3
      ];
    };

    this.cameraStyle.setFill(
      new Fill({
        color: colorRGB(),
      }));

    // Forza l'aggiornamento grafico della mappa
    this.map.render();
  }

  // Attiva modalità modifica e aggiorna il layout della mappa
  enableEditMode() {
    this.editMode = true;
    setTimeout(() => {
      this.map.updateSize();
    }, 100);
  }

  // Annulla le modifiche ed esce dalla modalità modifica
  cancelEditMode() {
    this.editMode = false;
    this.refresh();
    this.deselectCamera();
    setTimeout(() => {
      this.map.updateSize();
    }, 100);
  }

  saveForPatientFlag(flag: boolean) {
    this.selectedCamera.forPatient = flag;
    this.camereService.update(this.selectedCamera).subscribe((res) => {
      console.log(res);
    });
  }

  saveLayerCamera() {
    // Serializza l'oggetto di geometria prima del salvataggio
    this.selectedCamera.geometry = JSON.stringify(this.selectedCamera.geometryObject);

    this.camereService.update(this.selectedCamera).subscribe((res) => {
      this.messageService.showMessage("Camera Aggiornata!");
      this.editMode = false;
      this.refresh();
    });
  }

  deselectCamera() {
    this.selectedCamera = undefined;
    if (this.cameraLayerDebug) {
      this.cameraLayerDebug.setSource(undefined);
    }
  }

  // CORREZIONE 3: Inizializzazione sicura della nuova camera con aggiornamento mappa
  addCamera() {
    this.selectedCamera = new Camere();
    this.selectedCamera.camera = "Nuova Camera";
    this.selectedCamera.piano = this.selectedPiano;
    this.selectedCamera.forPatient = true;
    this.selectedCamera.geometryObject = JSON.parse(JSON.stringify(this.empty));
    this.selectedCamera.geometry = JSON.stringify(this.selectedCamera.geometryObject);

    this.camereService.add(this.selectedCamera).subscribe((res) => {
      this.selectedCamera = res;
      this.selectedCamera.geometryObject = JSON.parse(this.selectedCamera.geometry);
      this.getCamere(this.selectedPiano);
      this.updateLayerCamera();

      // Forza il ricalcolo della mappa dopo il rendering del DOM
      setTimeout(() => {
        this.map.updateSize();
      }, 100);
    });
  }

  removeCamera() {
    if (this.selectedCamera) {
      this.camereService.remove(this.selectedCamera).subscribe(() => {
        this.getCamere(this.selectedPiano);
        this.deselectCamera();
      });
    }
  }

  removePoint(index: number) {
    if (
      this.selectedCamera &&
      this.selectedCamera.geometryObject &&
      this.selectedCamera.geometryObject.features[0].geometry.coordinates[0]
    ) {
      this.selectedCamera.geometryObject.features[0].geometry.coordinates[0].splice(
        index,
        1
      );
      this.updateLayerCamera();
    }
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
    setTimeout(() => {
      this.map.updateSize();
    }, 100);
  }

  onPlanChange(event: MatSelectChange) {
    this.setPlan(event.value);
    this.getCamere(event.value as string);
    this.deselectCamera();
  }

  onChangeCamera(event: MatSelectChange) {
    this.selectedCamera = event.value;
    this.updateLayerCamera();
  }
}
