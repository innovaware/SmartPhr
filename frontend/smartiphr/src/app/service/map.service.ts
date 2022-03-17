import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import ImageLayer from "ol/layer/Image";
import Projection from "ol/proj/Projection";
import Static from "ol/source/ImageStatic";

@Injectable({
  providedIn: "root",
})
export class MapService {
  constructor(private httpClient: HttpClient) {}

  getPrimoPiano(): {
    layer: ImageLayer<Static>;
    extent: number[];
    projection: Projection;
    target: string;
  } {
    const extent = [0, 0, 1320, 1582];
    const projection = new Projection({
      code: "Piano terra",
      units: "pixels",
      extent: extent,
    });

    return this.getLayer(extent, projection, "./assets/primopiano.png", "ol-map");
  }

  getSecondoPiano(): {
    layer: ImageLayer<Static>;
    extent: number[];
    projection: Projection;
    target: string;
  } {
    const extent = [0, 0, 1320, 1582];
    const projection = new Projection({
      code: "Primo Piano",
      units: "pixels",
      extent: extent,
    });

    return this.getLayer(extent, projection, "./assets/secondopiano.png", "ol-map");
  }


  getPrimoChiesa(): {
    layer: ImageLayer<Static>;
    extent: number[];
    projection: Projection;
    target: string;
  } {
    const extent = [0, 0, 1320, 1582];
    const projection = new Projection({
      code: "Chiesa terra",
      units: "pixels",
      extent: extent,
    });

    return this.getLayer(extent, projection, "./assets/chiesaprimopiano.png", "ol-map");
  }

  getSecondoChiesa(): {
    layer: ImageLayer<Static>;
    extent: number[];
    projection: Projection;
    target: string;
  } {
    const extent = [0, 0, 1320, 1582];
    const projection = new Projection({
      code: "Chiesa 1° piano",
      units: "pixels",
      extent: extent,
    });

    return this.getLayer(extent, projection, "./assets/chiesasecondopiano.png", "ol-map");
  }

  getLayer(
    extent: number[],
    projection: Projection,
    url,
    target
  ): {
    layer: ImageLayer<Static>;
    extent: number[];
    projection: Projection;
    target: string;
  } {
    return {
      layer: new ImageLayer({
        source: new Static({
          // attributions: '1° Piano',
          url: url,
          projection: projection,
          imageExtent: extent,
        }),
      }),
      extent: extent,
      projection: projection,
      target: target,
    };
  }
}
