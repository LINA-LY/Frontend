declare module 'instascan' {
  export class Scanner {
    constructor(options: { video: HTMLElement | null });
    addListener(event: string, callback: (content: string) => void): void;
    start(camera: Camera): void;
    stop(): void;
  }

  export class Camera {
    static getCameras(): Promise<Camera[]>;
    id: string;
    name: string;
  }
}