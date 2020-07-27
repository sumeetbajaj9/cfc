import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  
People:any
  baseURL: string = "http://localhost:5000/";s
  constructor(private http: HttpClient) { }

 getPeople(): Observable<People[]> {
    console.log('getPeople '+this.baseURL + 'app')
    return this.http.get<People[]>(this.baseURL + 'app')
  }
 
  addPerson(dayfind:DayFind): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(dayfind);
    console.log(body)
    return this.http.post(this.baseURL + 'app/post', body,{'headers':headers})
  }
  MarkPerson(dayfind:DayFind): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(dayfind);
    console.log(body)
    return this.http.post(this.baseURL + 'app/markinfectedPerson', body,{'headers':headers})
  }

  HeatMap(str1:string): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(str1);
    return this.http.post(this.baseURL + 'app/heat', body,{'headers':headers})
  }
  ZoneMap(data:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(data);
    return this.http.post(this.baseURL + 'app/zone', body,{'headers':headers})
  }
  ShowZone(data:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(data);
    return this.http.post(this.baseURL + 'app/showzone', body,{'headers':headers})
  }
  HeatData(data:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    const body={'state':data};
    console.log(body);
    return this.http.post(this.baseURL + 'app/heatmapdetails', body,{'headers':headers})
  }
  
}
export interface People{
  firstName:string
  lastName:string
}
export interface DayFind{
  firstName:string
  lastName:string
}