import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SecurityService } from 'src/app/security/security.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements AfterViewInit {
  user = {
    userName: 'N/A',
    firstName: 'N/A',
    lastName: 'N/A',
    email: 'N/A',
  };
  orders: any[] = [];
  isEditing = false;
  editName = '';
  editEmail = '';

  constructor(
    public secService: SecurityService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    const interval = setInterval(() => {
      if (this.secService.profile) {
        const p = this.secService.profile;
        this.user = {
          userName: p.username || 'N/A',
          firstName: p.firstName || 'N/A',
          lastName: p.lastName || 'N/A',
          email: p.email || 'N/A',
        };
        this.loadOrders();
        clearInterval(interval);
      }
    }, 100);
  }

  private loadOrders(): void {
    const id = this.secService.profile?.id;
    if (!id) return;
    this.http
      .get<any[]>(`http://localhost:8081/api/orders/customer/${id}`)
      .subscribe(
        arr => (this.orders = arr.sort((a,b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )),
        () => this.orders = []
      );
  }

  startEdit(): void {
    this.editName = `${this.user.firstName} ${this.user.lastName}`.trim();
    this.editEmail = this.user.email;
    this.isEditing = true;
  }

  saveEdit(): void {
    const id = this.secService.profile?.id;
    if (!id) return;
    const [first, ...rest] = this.editName.trim().split(/\s+/);
    this.user.firstName = first;
    this.user.lastName = rest.join(' ');
    this.user.email = this.editEmail.trim();
    this.isEditing = false;

    const dto: any = {};
    if (this.user.firstName) dto.firstname = this.user.firstName;
    if (this.user.lastName) dto.lastname = this.user.lastName;
    if (this.user.email) dto.email = this.user.email;

    this.http.put(`http://localhost:8081/api/customers/${id}`, dto).subscribe();
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  deleteAccount(): void {
    if (!confirm('⚠️ This will delete your account. Continue?')) return;
    const id = this.secService.profile?.id;
    if (!id) return;
    this.http.delete(`http://localhost:8081/api/customers/${id}`)
      .subscribe(() => {
        this.secService.logout();
        this.router.navigateByUrl('/home');
      });
  }

  onAdmin(): void {
    this.router.navigateByUrl('/admin-info-panel');
  }
}
