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
import { InfirmierInterfaceComponent } from './infirmier-interface/infirmier-interface.component';
import { PatientInterfaceComponent } from './patient-interface/patient-interface.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'create-dpi', component: CreateDpiComponent, canActivate: [AuthGuard] },
  { path: 'dossier-patient', component: DossierPatientComponent, canActivate: [AuthGuard] },
  { path: 'medecin-interface-start', component: MedecinInterfaceStartComponent, canActivate: [AuthGuard] },
  { path: 'ordonnance', component: OrdonnanceComponent, canActivate: [AuthGuard] },
  { path: 'bilan', component: BilanComponent, canActivate: [AuthGuard] },
  { path: 'laborantin', component: LaborantinComponent, canActivate: [AuthGuard] },
  { path: 'soin', component: SoinComponent, canActivate: [AuthGuard] },
  { path: 'examensup', component: ExamensupComponent, canActivate: [AuthGuard] },
  { path: 'compterendu', component: CompterenduComponent, canActivate: [AuthGuard] },
  { path: 'infermier', component: InfirmierInterfaceComponent, canActivate: [AuthGuard] },
  { path: 'patient-interface', component: PatientInterfaceComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }