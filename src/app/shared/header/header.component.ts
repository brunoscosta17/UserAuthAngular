import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  private router: Router = inject(Router);

  auth = inject(AuthService);

  user = this.auth.user;

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
