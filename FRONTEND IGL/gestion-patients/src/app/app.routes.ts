import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import uniquement du composant infirmier-interface
import { InfirmierInterfaceComponent } from './infirmier-interface/infirmier-interface.component'; // Corrige ici le chemin d'importation

export const routes: Routes = [
  { path: 'infirmier-interface', component: InfirmierInterfaceComponent }, // Route pour l'interface de l'infirmier
  { path: '', redirectTo: 'infirmier-interface', pathMatch: 'full' },  // Une seule redirection par défaut
  { path: '**', redirectTo: 'infirmier-interface' }  // Redirection pour les routes inconnues
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
