import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  private router: Router = inject(Router);

  title = 'user-auth-angular';

  isPublicRoute(): boolean {
    return this.router.url.includes('/login') || this.router.url.includes('/register');
  }
}
