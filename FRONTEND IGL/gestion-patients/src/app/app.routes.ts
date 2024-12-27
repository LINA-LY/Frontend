import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importation des composants
import { LoginComponent } from './login/login.component';
import { CreationDpiComponent } from './creation-dpi/creation-dpi.component';
import { DossierPatientComponent } from './dossier-patient/dossier-patient.component'; // Ajoute ton composant
import { MedecinInterfaceStartComponent } from './medecin-interface-start/medecin-interface-start.component'; // Ajoute ton composant

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'creation-dpi', component: CreationDpiComponent },
  { path: 'dossier-patient', component: DossierPatientComponent }, // Ajoute la route
  { path: 'medecin-interface-start', component: MedecinInterfaceStartComponent }, // Ajoute la route
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
