import { Routes } from '@angular/router';
import { OrdonnanceComponent } from './ordonnance/ordonnance.component';

export const routes: Routes = [
  { path: '', redirectTo: '/ordonnance', pathMatch: 'full' },
  { path: 'ordonnance', component: OrdonnanceComponent },
];
