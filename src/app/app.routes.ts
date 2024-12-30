import { Routes } from '@angular/router';
import { OrdonnanceComponent } from './ordonnance/ordonnance.component';
import { BilanComponent } from './bilan/bilan.component';
import { LaborantinComponent } from './laborantin/laborantin.component';
import { SoinComponent } from './soin/soin.component';
import { ExamensupComponent } from './examensup/examensup.component';
import { CompterenduComponent } from './compterendu/compterendu.component';





export const routes: Routes = [
  { path: '', redirectTo: '/compterendu', pathMatch: 'full' },
  { path: 'ordonnance', component: OrdonnanceComponent },
  { path: 'bilan', component: BilanComponent },
  { path: 'laborantin', component: LaborantinComponent },
  { path: 'soin', component: SoinComponent },
  { path: 'examensup', component: ExamensupComponent },
  { path: 'compterendu', component: CompterenduComponent },



];


  

