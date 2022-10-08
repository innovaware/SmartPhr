import { Component, OnInit } from '@angular/core';
import { MapService } from 'src/app/service/map.service';

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

import ImageLayer from "ol/layer/Image";
import Projection from "ol/proj/Projection";
import Static from "ol/source/ImageStatic";
import { getCenter } from "ol/extent";
import { Camere } from 'src/app/models/camere';
import { CamereService } from 'src/app/service/camere.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';
import { Geometry } from 'ol/geom';
import { MessagesService } from 'src/app/service/messages.service';

@Component({
  selector: 'app-gestione-pulizia-ambienti',
  templateUrl: './gestione-pulizia-ambienti.component.html',
  styleUrls: ['./gestione-pulizia-ambienti.component.css']
})
export class GestionePuliziaAmbientiComponent implements OnInit {
  map: Map;
  camere: Observable<Camere[]>;
  selectedCamera: Camere;
  selectedCameraLayer: VectorLayer<VectorSource<Geometry>>;

  piano: {
    layer: ImageLayer<Static>;
    extent: number[];
    projection: Projection;
    target: string;
  };

  constructor(
    private mapService: MapService,
    private camereService: CamereService,
    private messageService: MessagesService,
  ) { }

  ngOnInit(): void {
    this.map = this.initMap();
    //this.addLayer(cam)
    this.loadCamere('1p')
    // this.camere.subscribe((cams: Camere[])=> {
    //   console.log(cams);

    //   cams.forEach(cam => this.addLayer(cam))
    // });

  }

  loadCamere(piano: string) {
    this.camere = this.camereService.getByPiano(piano)
      .pipe(
        map( (x: Camere[])=>
            x.filter(c=> c.forPatient !== true).sort((o1, o2)=> o1.order - o2.order)),
        map( (x: Camere[])=>
            x.map( c => {
              return {
                ...c,
                firmaArmadio: undefined,
                geometryObject: JSON.parse(c.geometry)
              };
            }))
    );
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

    const cameraStyle =  new Style({
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

    text.setText(`${camera.camera}`);
    text.getFill().setColor([0, 0, 0, 1] as Color);
    cameraStyle.setText(text);

    cameraStyle.setFill(
      new Fill({
        color: this.getColor(camera), //RGBA
      }));

    this.map.addLayer(cameraLayerDebug);

    return cameraLayerDebug;
  }

  removeLayer(layer: VectorLayer<VectorSource<Geometry>>) {
    if (layer !== undefined) {
      this.map.removeLayer(layer);
    }
  }

  getColor(camera: Camere) {
      switch(camera.statoPulizia) {
        case 0: // Sporco
          return [255, 0, 0, 0.3] as Color;
        case 1: // In Corso
          return [255, 177, 0, 0.3] as Color;
        case 2:// 2 Pulito
          return [0, 255, 0, 0.3] as Color;
        case 3:// 3 Straordinario
          return [0, 102, 255, 0.3] as Color;
        default:
          return [0, 0 ,0, 0.3] as Color;

      }
  }

  initMap() {
    this.piano = this.mapService.getPrimoPiano();

    return new Map({
      layers: [this.piano.layer],
      target: "ol-map",
      view: new View({
        projection: this.piano.projection,
        center: getCenter(this.piano.extent),
        zoom: 2,
        maxZoom: 8,
      }),
      controls: [],
      // interactions: [],
    });
  }


  onChangeCamera(event: MatSelectChange) {
    this.selectedCamera = event.value;

    this.removeLayer(this.selectedCameraLayer);
    this.selectedCameraLayer = this.addLayer(this.selectedCamera);

  }

  onChangeStatoPulizia(event: MatSelectChange) {
    const statoPulizia = event.value;
    console.log("Stato pulizia camera", this.selectedCamera.statoPulizia);

    this.removeLayer(this.selectedCameraLayer);
    this.selectedCameraLayer = this.addLayer(this.selectedCamera);
  }

  salvaStatoPulizia() {
    console.log('Salva stato di pulizia della camera: ', this.selectedCamera);
    this.camereService.update(this.selectedCamera)
        .subscribe(res=> {
          console.log("Salvataggio eseguito con successo", res);

          this.messageService.showMessageError("Stato di Pulizia aggiornato correttamente");
        },
        err=> {
          console.error("Error: ", err);
          this.messageService.showMessageError("Errore nell'aggiornamento");
        });
  }

}
