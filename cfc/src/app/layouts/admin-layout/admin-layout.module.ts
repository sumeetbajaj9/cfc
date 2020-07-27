import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { ZoneComponent } from '../../zone/zone.component';
import { MarkInfectedComponent } from '../../mark-infected/mark-infected.component';
import { TrackComponent } from '../../track/track.component';
import { HeatComponent } from '../../heat/heat.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table'
import { HttpClientModule } from '@angular/common/http';
import {DashboardService} from '../../dashboard.service'
import {MatDatepickerModule } from '@angular/material/datepicker'
import {MatNativeDateModule} from '@angular/material/core';
import { DatePipe } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatTableModule,
    MatDatepickerModule,MatNativeDateModule
  ],
  declarations: [
    ZoneComponent,
    MarkInfectedComponent,
    TrackComponent,
    HeatComponent,
  
  ],
  providers: [
    DashboardService,DatePipe,HttpClientModule
  ]
})

export class AdminLayoutModule {}
