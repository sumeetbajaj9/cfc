import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {DashboardService} from '../dashboard.service'
declare var $: any;
@Component({
  selector: 'app-mark-infected',
  templateUrl: './mark-infected.component.html',
  styleUrls: ['./mark-infected.component.css']
})
export class MarkInfectedComponent {

  constructor(private api:DashboardService) { }

  infectedForm = new FormGroup({
    ipid: new FormControl(''),
  }
  );

  MarkInfectedPerson(){
    console.log(this.infectedForm.value);
    this.api.MarkPerson(this.infectedForm.value)
    .subscribe(data=>{
      console.log(data)
    }
    
    )
    
    this.showNotification('top','center',this.infectedForm.value.ipid);
  }

  showNotification(from, align,value){
    const type = ['','info','success','warning','danger'];

    const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
        icon: "notifications",
        message: "Successfully Marked the Infected Person."+value

    },{
        type: type[color],
        timer: 4000,
        placement: {
            from: from,
            align: align
        },
        template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-danger alert-with-icon" role="alert">' +
          '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          '</div>' +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
        '</div>'
    });
}

}
