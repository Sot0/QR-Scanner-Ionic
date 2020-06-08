import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var mapboxgl: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {

  latitud: number;
  longitud: number;

  constructor(
    private router: ActivatedRoute
  ) { }

  ngOnInit() {
    let geo: any = this.router.snapshot.paramMap.get('geo');

    geo = geo.substring(4);
    geo = geo.split(',');

    this.latitud = Number(geo[0]);
    this.longitud = Number(geo[1]);
  }

  ngAfterViewInit() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibHVpc3NvdG8iLCJhIjoiY2tiNDZnOGExMHNkbDJ0bXRnaW5zbmV1YSJ9.uyUhDWFOUGGbfAJUNJFU9Q';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [this.longitud, this.latitud],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6
    });

    map.on('load', () => {
      map.resize();

      // Marker
      new mapboxgl.Marker()
      .setLngLat([this.longitud, this.latitud])
      .addTo(map);

      // Insert the layer beneath any symbol layer.
      const layers = map.getStyle().layers;

      let labelLayerId;
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
          labelLayerId = layers[i].id;
          break;
        }
      }

      map.addLayer(
        {
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
            'fill-extrusion-color': '#aaa',
            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
          }
        },
        labelLayerId
      );
    });
  }

}
