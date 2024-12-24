import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CreationDpiComponent } from './creation-dpi/creation-dpi.component';
import { MedecinInterfaceStartComponent } from './medecin-interface-start/medecin-interface-start.component';
import { DossierPatientComponent } from './dossier-patient/dossier-patient.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'creation-dpi', component: CreationDpiComponent },
  { path: 'medecin-interface-start', component: MedecinInterfaceStartComponent },
  { path: 'dossier-patient', component: DossierPatientComponent }, // Route pour le dossier patient
  { path: '', redirectTo: 'login', pathMatch: 'full' },  // Une seule redirection par défaut
  { path: '**', redirectTo: 'login' }  // Une seule redirection pour les routes inconnues
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
