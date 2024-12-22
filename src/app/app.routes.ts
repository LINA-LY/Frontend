import { Routes } from '@angular/router';
import { OrdonnanceComponent } from './ordonnance/ordonnance.component';
import { BilanComponent } from './bilan/bilan.component';
import { LaborantinComponent } from './laborantin/laborantin.component';


export const routes: Routes = [
  { path: '', redirectTo: '/laborantin', pathMatch: 'full' },
  { path: 'ordonnance', component: OrdonnanceComponent },
  { path: 'bilan', component: BilanComponent },
  { path: 'laborantin', component: LaborantinComponent },
];


  

