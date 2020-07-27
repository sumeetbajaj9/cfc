import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { DashboardService } from '../dashboard.service';
@Component({
  selector: 'app-heat',
  templateUrl: './heat.component.html',
  styleUrls: ['./heat.component.css']
})
export class HeatComponent implements OnInit {
  map: mapboxgl.Map;
  marker:mapboxgl.Marker;
  style = 'mapbox://styles/mapbox/dark-v10';
  name='Sumeet';
  center1: [74.737737, 19.110321]
  people:People[];
  constructor(private api:DashboardService) { }
    count:any;
    state:any;
    Show=true;


  MapMark(people){
  Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set('pk.eyJ1Ijoic3VtZWV0YmFqYWoiLCJhIjoiY2s4enllN2NpMDBqMDNlbWhmdXZ3anQ4biJ9.AfFU8LaGYdC-c0B22lm3eQ');
  this.map = new mapboxgl.Map({
    container: 'map',
    style: this.style,
    zoom: 5,
    center:[ 88.405632,22.571020] 
}
);
this.map.on('load',(e)=>{
  this.loadData(people);
})
this.map.addControl(new mapboxgl.NavigationControl());
this.map.on('click', 'people-point',  (e) => {
   if(e.features[0].geometry.type==='Point'){
    new mapboxgl.Popup()
    .setLngLat([e.features[0].geometry.coordinates[0],e.features[0].geometry.coordinates[1]]) /* Find & set the coordinates for the pop-up. */
    .setHTML('<b>PID:</b> '+ e.features[0].properties.pid) /* Set and add the HTML to the pop-up. */
    .addTo(this.map);
   } /* Add layer to the map. */
  //   console.log("hi")
  console.log("Hi")
});
}


/*addLayers(){
  this.map.addLayer(
    {
        'id': 'people',
        'type': 'heatmap',
        'source': 'people',
        'maxzoom': 9,
        'paint': {
            // Increase the heatmap weight based on frequency and property magnitude
            'heatmap-weight': [
                'interpolate',
                ['linear'],
                ['get', 'mag'],
                0,
                0,
                6,
                1
            ],
            // Increase the heatmap color weight weight by zoom level
            // heatmap-intensity is a multiplier on top of heatmap-weight
            'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                1,
                9,
                3
            ],
            // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
            // Begin color ramp at 0-stop with a 0-transparancy color
            // to create a blur-like effect.
            'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0,
                'rgba(33,102,172,0)',
                0.2,
                'rgb(103,169,207)',
                0.4,
                'rgb(209,229,240)',
                0.6,
                'rgb(253,219,199)',
                0.8,
                'rgb(239,138,98)',
                1,
                'rgb(178,24,43)'
            ],
            // Adjust the heatmap radius by zoom level
            'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                2,
                9,
                20
            ],
            // Transition from heatmap to circle layer by zoom level
            'heatmap-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                7,
                1,
                9,
                0
            ]
        }
    },
    'waterway-label'
);
}*/
  ngOnInit() {
  }
  HeatMapLoad(){
      this.Show=false;
    this.api.HeatMap(this.name)
    .subscribe(data=>{
      console.log(data)
      this.people=data.response      
      this.MapMark(this.people);
      console.log(this.people)
    })
  }

  loadData(people){
      var hoveredStateId=null
  this.map.addSource('people', {
    type: 'geojson',
   data:people
  });
  this.map.addLayer(
    {
        'id': 'people',
        'type': 'heatmap',
        'source': 'people',
        'maxzoom': 9,
        'paint': {
            // Increase the heatmap weight based on frequency and property magnitude
            'heatmap-weight': [
                'interpolate',
                ['linear'],
                ['get', 'mag'],
                0,
                0,
                6,
                1
            ],
            // Increase the heatmap color weight weight by zoom level
            // heatmap-intensity is a multiplier on top of heatmap-weight
            'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                1,
                9,
                3
            ],
            // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
            // Begin color ramp at 0-stop with a 0-transparancy color
            // to create a blur-like effect.
            'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0,
                'rgba(33,102,172,0)',
                0.2,
                'rgb(103,169,207)',
                0.4,
                'rgb(209,229,240)',
                0.6,
                'rgb(253,219,199)',
                0.8,
                'rgb(239,138,98)',
                1,
                'rgb(178,24,43)'
            ],
            // Adjust the heatmap radius by zoom level
            'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                2,
                9,
                20
            ],
            // Transition from heatmap to circle layer by zoom level
            'heatmap-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                7,
                1,
                9,
                0
            ]
        }
    },
    'waterway-label'
);
this.map.addLayer(
  {
      'id': 'people-point',
      'type': 'circle',
      'source': 'people',
      'minzoom': 7,
      'paint': {
          // Size circle radius by earthquake magnitude and zoom level
          'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7,
              ['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
              16,
              ['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50]
          ],
          // Color circle by earthquake magnitude
          'circle-color': [
              'interpolate',
              ['linear'],
              ['get', 'mag'],
              1,
              'rgba(33,102,172,0)',
              2,
              'rgb(103,169,207)',
              3,
              'rgb(209,229,240)',
              4,
              'rgb(253,219,199)',
              5,
              'rgb(239,138,98)',
              6,
              'rgb(178,24,43)'
          ],
          'circle-stroke-color': 'white',
          'circle-stroke-width': 1,
          // Transition from heatmap to circle layer by zoom level
          'circle-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7,
              0,
              8,
              1
          ]
      }
  },
  'waterway-label'
);
this.map.addSource('states', {
    'type': 'geojson',
    'data':
    'https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson'
    });
     
    // The feature-state dependent fill-opacity expression will render the hover effect
    // when a feature's hover state is set to true.
    this.map.addLayer({
    'id': 'state-fills',
    'type': 'fill',
    'source': 'states',
    'layout': {},
    'paint': {
    'fill-color': '#627BC1',
    'fill-opacity': [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    1,
    0.5
    ]
    }
    });
     
    this.map.addLayer({
    'id': 'state-borders',
    'type': 'line',
    'source': 'states',
    'layout': {},
    'paint': {
    'line-color': '#627BC1',
    'line-width': 2
    }
    });
    // this.map.on('mousemove', 'state-fills', function(e) {
    //     if (e.features.length > 0) {
    //     if (hoveredStateId) {
    //     }
    //     hoveredStateId = e.features[0].properties.ID_1;
    //     }
    //     });
        this.map.on('click','state-fills',(e)=>{
            console.log(e.features[0].properties.NAME_1)  
            this.api.HeatData(e.features[0].properties.NAME_1)
    .subscribe(data=>{
      console.log(data)
        this.count=data.response.count
        this.state=data.response.state
        console.log(this.count)
        console.log(this.state)
        })
    }) 
        // When the mouse leaves the state-fill layer, update the feature state of the
        // previously hovered feature.
        // this.map.on('mouseleave', 'state-fills', function() {
        // if (hoveredStateId) {
        // }
        // hoveredStateId = null;
        // });
        

}


}
export interface People{
    firstName:string
    lastName:string
}