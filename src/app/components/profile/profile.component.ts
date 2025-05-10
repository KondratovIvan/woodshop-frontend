import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/Customer.model';
import { SecurityService } from 'src/app/security/security.service';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';
import { AfterViewInit } from '@angular/core';

// interface Order {
//   id: number;
//   date: string;
//   total: number;
//   status: string;
// }

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements AfterViewInit {
  constructor(public secService: SecurityService, private http: HttpClient, private router: Router) {}

  user = {
  userName: this.secService.profile ? this.secService.profile.username : 'N/A',
    firstName: this.secService.profile ? this.secService.profile.firstName : 'N/A',
    lastName: this.secService.profile ? this.secService.profile.lastName : 'N/A',
    email: this.secService.profile ? this.secService.profile.email : 'N/A',
  };

  // user: Partial<Customer> = {
  //   firstname: 'Firstname',
  //   lastname: 'Secondname',
  //   email: 'user@example.com',
  // };

  orders: any[] = [];

  // orders = [
  //   { id: 101, date: '2024-04-01', total: 2999, status: 'Доставлен' },
  //   { id: 102, date: '2024-04-12', total: 1499, status: 'В обработке' },
  // ];

  ngAfterViewInit(): void {
    const checkProfile = setInterval(() => {
      const profile = this.secService.profile;
      if (profile) {
        this.user.userName = profile.username || 'N/A';
        this.user.firstName = profile.firstName || 'N/A';
        this.user.lastName = profile.lastName || 'N/A';
        this.user.email = profile.email || 'N/A';
        this.getOrders();
        clearInterval(checkProfile); // остановить проверку
      }
    }, 100); // проверяем каждые 100мс
  }

  getOrders(): void {
    const customerId = this.secService.profile?.id;
    if (!customerId) return;

    this.http
      .get<any[]>(`http://localhost:8081/api/orders/customer/${customerId}`)
      .subscribe(
        (orders) => {
          this.orders = orders.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          console.log('Orders fetched:', orders);
        },
        (error) => {
          console.error('Failed to fetch orders:', error);
          this.orders = [];
        }
      );
  }

  isEditing = false;
  editName = '';
  editEmail = '';

  startEdit(): void {
    console.log(this.secService.profile)
    this.editName = (this.user.firstName + ' ' + this.user.lastName).trim();
    this.editEmail = this.user.email ?? '';
    this.isEditing = true;
  }

  saveEdit(): void {
    const customerId = this.secService.profile?.id;
    const names = this.editName.trim().split(/\s+/);
    this.user.firstName = names.shift() || '';
    this.user.lastName = names.join(' ') || '';
    this.user.email = this.editEmail.trim();
    this.isEditing = false;

    const updateDto: any = {};
    if (this.user.firstName) updateDto.firstname = this.user.firstName;
    if (this.user.lastName) updateDto.lastname = this.user.lastName;
    if (this.user.email) updateDto.email = this.user.email;

    this.http
      .put(`http://localhost:8081/api/customers/${customerId}`, updateDto)
      .subscribe({
        next: () => console.log('User info successfully updated'),
        error: (err) => console.error('Update failed:', err),
      });

    console.log('User info updated:', this.user);
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  deleteAccount(): void {
    const confirmed = confirm('⚠️ Warning!\nYour account will be deleted forever. Are you sure?');
  if (!confirmed) return;

  const customerId = this.secService.profile?.id;
  if (!customerId) return;

  // if (!confirm('Are you sure you want to delete your account ?')) return;

    this.http.delete(`http://localhost:8081/api/customers/${customerId}`).subscribe({
      next: () => {
        console.log('Account successfully deleted!');
        this.secService.logout();
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        console.error('Error deleting account:', err);
        alert('Error deleting account');
      }
    });
  }
}