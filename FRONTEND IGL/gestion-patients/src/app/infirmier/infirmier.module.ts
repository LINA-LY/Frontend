import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Nécessaire pour *ngFor et *ngIf
import { InfirmierInterfaceComponent } from './infirmier-interface.component'; // Ton composant

@NgModule({
  declarations: [
    InfirmierInterfaceComponent, // Déclare ton composant
  ],
  imports: [
    CommonModule, // Ajoute CommonModule ici
  ],
  exports: [InfirmierInterfaceComponent], // Pour rendre le composant disponible ailleurs si nécessaire
})
export class InfirmierModule {}
