import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Nécessaire pour ngx-toastr
import { ToastrModule } from 'ngx-toastr'; // Importe ToastrModule

@NgModule({
  imports: [
    BrowserAnimationsModule, // Ajoute BrowserAnimationsModule ici
    ToastrModule.forRoot({ // Configure ToastrModule ici
      timeOut: 3000, // Durée d'affichage des notifications (en ms)
      positionClass: 'toast-top-right', // Position des notifications
      preventDuplicates: true, // Empêche les notifications en double
    }),
  ],
  exports: [ToastrModule], // Exporte ToastrModule pour qu'il soit utilisable ailleurs
})
export class AppToastrModule {}