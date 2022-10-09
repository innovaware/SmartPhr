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
import { Constants } from 'src/app/Constants';

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

  selectedPiano: string;
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
  ) {
    this.selectedPiano = '1p';
   }

  ngOnInit(): void {
    this.pianoTerra = this.mapService.getPrimoPiano();
    this.pianoPrimo = this.mapService.getSecondoPiano();
    this.pianoChiesaTerra = this.mapService.getPrimoChiesa();
    this.pianoChiesaPrimo = this.mapService.getSecondoChiesa();

    this.piano = this.pianoTerra;
    this.map = this.initMap();
    //this.addLayer(cam)
    this.loadCamere(this.selectedPiano);
  }

  loadCamere(piano: string) {
    this.camere = this.camereService.getByPiano(piano)
      .pipe(
        //map( (x: Camere[])=>
        //    x.filter(c=> c.forPatient !== true)),
        map((x: Camere[])=> x.sort((o1, o2)=> o1.order - o2.order)),
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
          return Constants.SporcoRGB;
        case 1: // In Corso
          return Constants.InCorsoRGB;
        case 2:// 2 Pulito
          return Constants.PulitoRGB;
        case 3:// 3 Straordinario
	        return Constants.StraordinarioRGB;
        default:
          // Default Color
          return Constants.DefaultRGB;

      }
  }

  initMap() {
    return this.loadPiano(this.piano);
  }

  loadPiano(piano) {
    return new Map({
      layers: [piano.layer],
      target: "ol-map",
      view: new View({
        projection: piano.projection,
        center: getCenter(piano.extent),
        zoom: 2,
        maxZoom: 8,
      }),
      controls: [],
      // interactions: [],
    });
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
  }

  onChangePiano(event: MatSelectChange) {
    this.selectedPiano = event.value;
    console.log('Selezionato Piano:', this.selectedPiano);
    this.setPlan(this.selectedPiano);

    this.removeLayer(this.selectedCameraLayer);
    this.selectedCamera = undefined;
    this.selectedCameraLayer = undefined;

    this.loadCamere(this.selectedPiano);
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
