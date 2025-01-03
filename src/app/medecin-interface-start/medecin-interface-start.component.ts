import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../services/searchService.service';
import { AuthService } from '../services/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import jsQR from 'jsqr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-medecin-interface-start',
  templateUrl: './medecin-interface-start.component.html',
  styleUrls: ['./medecin-interface-start.component.css'],
   imports: [CommonModule, FormsModule],
})
export class MedecinInterfaceStartComponent implements OnInit, OnDestroy {
  dpiData: any = {};
  videoElement!: HTMLVideoElement;
  canvasElement!: HTMLCanvasElement;
  canvasContext!: CanvasRenderingContext2D;
  scanActive = false;
  scanResult: string | null = null;
  private isBrowser: boolean;

  constructor(
    private router: Router,
    private searchService: SearchService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId); // Vérifie si on est dans un navigateur
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.videoElement = document.createElement('video');
      this.canvasElement = document.getElementById('qr-canvas') as HTMLCanvasElement;
      this.canvasContext = this.canvasElement.getContext('2d')!;
    }
  }

  async startScan(): Promise<void> {
    if (!this.isBrowser) return;

    this.scanActive = true;
    this.scanResult = null;

    // Accéder à la caméra
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    this.videoElement.srcObject = stream;
    this.videoElement.setAttribute('playsinline', 'true'); // iOS compatibility
    this.videoElement.play();

    requestAnimationFrame(this.scan.bind(this));
  }

  scan(): void {
    if (!this.scanActive || !this.isBrowser) return;

    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      this.canvasElement.hidden = false;

      // Dessiner l'image de la caméra sur le canvas
      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;
      this.canvasContext.drawImage(this.videoElement, 0, 0, this.canvasElement.width, this.canvasElement.height);

      // Récupérer les données de l'image
      const imageData = this.canvasContext.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);

      // Décoder le QR code avec jsQR
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code) {
        this.scanResult = code.data;
        this.onSearch(this.scanResult); // Appeler la méthode de recherche avec le NSS récupéré du QR code
        this.stopScan();
      } else {
        requestAnimationFrame(this.scan.bind(this));
      }
    } else {
      requestAnimationFrame(this.scan.bind(this));
    }
  }

  stopScan(): void {
    if (!this.isBrowser || !this.videoElement) return;

    this.scanActive = false;
    const stream = this.videoElement.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    this.videoElement.srcObject = null;
  }

  navigateToCreationDpi(): void {
    console.log('Navigation vers dossier-patient');
    this.router.navigate(['/create-dpi']);
  }

  onSearch(nss: string): void {
    if (!nss) {
      console.error('NSS non fourni');
      return;
    }

    this.searchService.searchDpi(nss).subscribe(
      (data) => {
        console.log('Résultat de la recherche :', data);
        this.router.navigate(['/dossier-patient'], {
          state: { dossierData: data }, // Transmet les données via l'état de la navigation
        });
      },
      (error) => {
        console.error('Erreur lors de la recherche :', error);
        if (error.status === 404) {
          console.error('Aucun dossier trouvé pour ce NSS.');
        } else {
          console.error('Une erreur est survenue. Veuillez réessayer plus tard.');
        }
      }
    );
  }

  onLogout(): void {
    this.authService.logout(); // Déconnectez l'utilisateur
    this.router.navigate(['/login']); // Redirigez vers la page de connexion
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.stopScan(); // Arrêter le scan lorsque le composant est détruit
    }
  }
}