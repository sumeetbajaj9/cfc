import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import * as mapboxgl from 'mapbox-gl';
import { FormGroup, FormControl } from '@angular/forms';
import {DashboardService} from '../dashboard.service'

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.css']
})
export class ZoneComponent implements OnInit{

  constructor(private api:DashboardService) {}
  

 
  ngOnInit() {
    }
    
    map: mapboxgl.Map;
    marker:mapboxgl.Marker;
    style = 'mapbox://styles/mapbox/streets-v11';
    data1:any
    data2:any
    data3:any
    data4:any
    create:any=function (center:any,radiusInKm:any,points:any) {
      if(!points) points=64
      var coords = 
      {
        latitude: center[1],
        longitude: center[0]
      };
      var km = radiusInKm;
      var ret = [];
      var distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
      var distanceY = km/110.574;
      var theta, x, y;
      for(var i=0; i<points; i++)
      {
        theta = (i/points)*(2*Math.PI);
        x = distanceX*Math.cos(theta);
        y = distanceY*Math.sin(theta);
        ret.push([coords.longitude+x, coords.latitude+y]);
      }
      ret.push(ret[0]);
      return {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [ret]
                    }
                }]
            }
        };
      }
    
    
    zoneForm = new FormGroup({
      zone: new FormControl(''),
    }
    );
  
  createGeoJSONCircle(center, radiusInKm, points){
      if(!points) points=64
        var coords = {
      latitude: center[1],
      longitude: center[0]
      };
  var km = radiusInKm;
  
  var ret = [];
  var distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
  var distanceY = km/110.574;
  
  var theta, x, y;
  for(var i=0; i<points; i++) {
      theta = (i/points)*(2*Math.PI);
      x = distanceX*Math.cos(theta);
      y = distanceY*Math.sin(theta);
  
      ret.push([coords.longitude+x, coords.latitude+y]);
  }
  ret.push(ret[0]);
          return {
              "type": "geojson",
              "data": {
                  "type": "FeatureCollection",
                  "features": [{
                      "type": "Feature",
                      "geometry": {
                          "type": "Polygon",
                          "coordinates": [ret]
                      }
                  }]
              }
          };
    }
  ShowMap(data){
    Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set('pk.eyJ1Ijoic3VtZWV0YmFqYWoiLCJhIjoiY2s4enllN2NpMDBqMDNlbWhmdXZ3anQ4biJ9.AfFU8LaGYdC-c0B22lm3eQ');
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 12,
      center: [data.long, data.lat]
  }
  );
  this.map.addControl(new mapboxgl.NavigationControl());
  //this.data2=this.createGeoJSONCircle([data.long,data.lat],3,5)
  //this.AddLayers(data)
  }
  
  ShowZone(){
      this.api.ZoneMap(this.zoneForm.value)
      .subscribe(data=>{
        
        this.data1=data.response
        this.ShowMap(this.data1)
      })
    }
  
  AddLayers(data){
    this.map.on('load',(e)=>{
      this.loadData(data);
    })
  }
    
  loadData(data){
      this.map.addSource("source_circle_500",this.create([data.long,data.lat],5));
      this.map.addLayer({
        "id": "circle500",
        "type": "fill",
        "source": "source_circle_500",
        "layout":{},
        "paint": {
        "fill-color": "orange",
        "fill-opacity": 0.6
    }
      });
    }
  
    consoler(){
  this.api.ShowZone(this.zoneForm.value)
      .subscribe(data=>{
        this.data1=data.response
        this.data2=data.response
        this.data1.forEach(element => {
          var color:string
          if(element.count>14){
           color="red" 
          }
          else if(element.count<14 && element.count>5){
            color="orange"
          }
          else{
            color="green"
          }
          this.map.addSource(element.latitude.toString(),this.create([element.longitude,element.latitude],0.1))
          this.map.addLayer({
            "id": element.longitude.toString(),
            "type": "fill",
            "source": element.latitude.toString(),
            "layout":{},
            "paint": {
            "fill-color": color,
            "fill-opacity": 0.6
        }
          });
        });
      })
    }
}

