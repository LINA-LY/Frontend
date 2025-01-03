import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importation des composants
import { LoginComponent } from './login/login.component';
import { CreateDpiComponent } from './creation-dpi/creation-dpi.component';
import { DossierPatientComponent } from './dossier-patient/dossier-patient.component'; 
import { MedecinInterfaceStartComponent } from './medecin-interface-start/medecin-interface-start.component'; 
import { OrdonnanceComponent } from './ordonnance/ordonnance.component';
import { BilanComponent } from './bilan/bilan.component';
import { LaborantinComponent } from './laborantin/laborantin.component';
import { SoinComponent } from './soin/soin.component';
import { ExamensupComponent } from './examensup/examensup.component';
import { CompterenduComponent } from './compterendu/compterendu.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'create-dpi', component: CreateDpiComponent },
  { path: 'dossier-patient', component: DossierPatientComponent },
  { path: 'medecin-interface-start', component: MedecinInterfaceStartComponent },
  { path: 'ordonnance', component: OrdonnanceComponent },
  { path: 'bilan', component: BilanComponent },
  { path: 'laborantin', component: LaborantinComponent },
  { path: 'soin', component: SoinComponent },
  { path: 'examensup', component: ExamensupComponent },
  { path: 'compterendu', component: CompterenduComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirection par défaut
  { path: '**', redirectTo: 'login' }, // Redirection pour les chemins inconnus
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }