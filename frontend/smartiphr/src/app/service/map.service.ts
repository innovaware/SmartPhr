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
  } {
    const extent = [0, 0, 1320, 1582];
    const projection = new Projection({
      code: "Piano terra",
      units: "pixels",
      extent: extent,
    });

    return this.getLayer(extent, projection, "./assets/primopiano.png");
  }

  getSecondoPiano(): {
    layer: ImageLayer<Static>;
    extent: number[];
    projection: Projection;
  } {
    const extent = [0, 0, 726, 882];
    const projection = new Projection({
      code: "Primo Piano",
      units: "pixels",
      extent: extent,
    });

    return this.getLayer(extent, projection, "./assets/secondopiano.png");
  }


  getPrimoChiesa(): {
    layer: ImageLayer<Static>;
    extent: number[];
    projection: Projection;
  } {
    const extent = [0, 0, 292, 882];
    const projection = new Projection({
      code: "Chiesa terra",
      units: "pixels",
      extent: extent,
    });

    return this.getLayer(extent, projection, "./assets/chiesaprimopiano.png");
  }

  getSecondoChiesa(): {
    layer: ImageLayer<Static>;
    extent: number[];
    projection: Projection;
  } {
    const extent = [0, 0, 355, 848];
    const projection = new Projection({
      code: "Chiesa 1° piano",
      units: "pixels",
      extent: extent,
    });

    return this.getLayer(extent, projection, "./assets/chiesasecondopiano.png");
  }

  getLayer(
    extent: number[],
    projection: Projection,
    url
  ): {
    layer: ImageLayer<Static>;
    extent: number[];
    projection: Projection;
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
    };
  }
}
