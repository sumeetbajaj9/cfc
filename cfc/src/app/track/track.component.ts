import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { FormGroup, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {DashboardService} from '../dashboard.service'
import { from } from 'rxjs';
@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent   {
  people:People[]
  people1:People[]
  color1:string  
  infectedForm = new FormGroup({
    pid: new FormControl(''),
    date: new FormControl('')
  })
  map: mapboxgl.Map;
  marker:mapboxgl.Marker;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 19.110594;
  lng = 74.735584;
   constructor(private datePipe : DatePipe,private api:DashboardService) { }
MapMark(people){
  this.people1 =people
  Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set('pk.eyJ1Ijoic3VtZWV0YmFqYWoiLCJhIjoiY2s4enllN2NpMDBqMDNlbWhmdXZ3anQ4biJ9.AfFU8LaGYdC-c0B22lm3eQ');
  this.map = new mapboxgl.Map({
    container: 'map',
    style: this.style,
    zoom: 15,
    center: [this.lng, this.lat]
});
this.map.addControl(new mapboxgl.NavigationControl());
people.forEach(element => {
  if(element.distance<300){
    this.color1='red'
  }
  else{
    this.color1='orange'
  }
new mapboxgl.Marker({color:this.color1}).setLngLat([element.longitude,element.latitude]).addTo(this.map).setDraggable(true).setPopup(new mapboxgl.Popup().setText(
"PID: "+element.pid+"    Status:"+element.status)).togglePopup();
});
people.forEach(element => {
new mapboxgl.Marker({color:'black'}).setLngLat([element.iplongitude,element.iplatitude]).addTo(this.map).setDraggable(true).setPopup(new mapboxgl.Popup().setText(
"PID: "+element.ipid+"   Status:"+element.infstatus)).togglePopup();
});
}
onSubmit() {
  // TODO: Use EventEmitter with form value
  console.log(this.infectedForm.value)
  this.infectedForm.value.date=this.datePipe.transform(this.infectedForm.value.date, 'yyyy-MM-dd')
  this.api.addPerson(this.infectedForm.value)
  .subscribe(data=>{
    console.log(data)
    this.people=data.response
    this.MapMark(this.people);
    
    console.log(this.people)
  })
}
}

export interface People{

}
