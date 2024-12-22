import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';   // Vous pouvez laisser appConfig si vous avez une configuration personnalisée
import { AppComponent } from './app/app.component'; // Assurez-vous que AppComponent est bien un composant autonome

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
