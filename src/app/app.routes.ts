import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importation des composants
import { LoginComponent } from './login/login.component';
import { CreateDpiComponent } from './creation-dpi/creation-dpi.component';
import { DossierPatientComponent } from './dossier-patient/dossier-patient.component'; 
import { MedecinInterfaceStartComponent } from './medecin-interface-start/medecin-interface-start.component'; 

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'create-dpi', component: CreateDpiComponent },
  { path: 'dossier-patient', component: DossierPatientComponent }, 
  { path: 'medecin-interface-start', component: MedecinInterfaceStartComponent }, 
  { path: '', redirectTo: 'login', pathMatch: 'full' }, 
  { path: '**', redirectTo: 'login' } 
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }