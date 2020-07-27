import { Routes } from '@angular/router';

import { ZoneComponent } from '../../zone/zone.component';
import { MarkInfectedComponent } from '../../mark-infected/mark-infected.component';
import { TrackComponent } from '../../track/track.component';
import { HeatComponent } from '../../heat/heat.component';

export const AdminLayoutRoutes: Routes = [
   
    { path: 'zone',      component: ZoneComponent },
    { path: 'markinfectedperson',   component: MarkInfectedComponent },
    { path: 'track',     component: TrackComponent },
    { path: 'heat',     component: HeatComponent },
  
];
