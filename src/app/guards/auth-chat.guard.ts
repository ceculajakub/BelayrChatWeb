import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthChatGuard implements CanActivate {
  private router = inject(Router);
  constructor() {}

  canActivate(): boolean {
    const username = sessionStorage.getItem('user');
    const roomName = sessionStorage.getItem('room');

    if (username && roomName) {
      return true;
    }

    this.router.navigate(['/join-room']);
    return false;
  }
}
