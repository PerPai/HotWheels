import { Component, HostListener, inject } from '@angular/core';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'front';
  authSrv = inject(AuthService);
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler() {
    this.authSrv.logout();
  }
}
