import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ContactComponent } from './components/contact/contact.component';
import { SearchedProductsListComponent } from './components/searched-products-list/searched-products-list.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { AuthGuard } from './security/guards/sec.guard';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { DeliveryComponent } from './components/footer/delivery/delivery.component';
import { PaymentsComponent } from './components/footer/payments/payments.component';
import { RecommendationsComponent } from './components/footer/recommendations/recommendations.component';
import { LegalNoticeComponent } from './components/footer/legal-notice/legal-notice.component';
import { TermsComponent } from './components/footer/terms/terms.component';
import { FaqComponent } from './components/footer/faq/faq.component';
import { RefundComponent } from './components/footer/refund/refund.component';
import { SupportComponent } from './components/footer/support/support.component';
import { PartnerComponent } from './components/footer/partner/partner.component';

const routes: Routes = [
  {
    path: 'cart',
    component: ShoppingCartComponent,
    canActivate: [AuthGuard],
    data: { roles: ['USER', 'ADMIN'] },
  },
  // {
  //   path: 'cart',
  //   component: ShoppingCartComponent,
  // },
  {path: 'cart-checkout', component: CheckoutComponent, canActivate: [AuthGuard], data: { roles: ['USER', 'ADMIN'] }},
  { path: 'product-details', component: ProductDetailsComponent,  canActivate: [AuthGuard],data: { roles: ['USER', 'ADMIN'] }},
  { path: 'searched-products', component: SearchedProductsListComponent },
  { path: 'contact', component: ContactComponent },
  {path : "admin" , component:AdminDashboardComponent , canActivate:[AuthGuard]  , data : {roles : ['ADMIN']}},
  {path : "addProduct" , component:AddProductComponent ,canActivate:[AuthGuard]  , data : {roles : ['ADMIN']}},
  {path : "edit-product" , component:EditProductComponent , canActivate:[AuthGuard]  , data : {roles : ['ADMIN']}},
  { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent },
  { path: 'delivery',          component: DeliveryComponent },
  { path: 'payments',          component: PaymentsComponent },
  { path: 'recommendations',   component: RecommendationsComponent },
  { path: 'legal-notice',      component: LegalNoticeComponent },
  { path: 'terms',             component: TermsComponent },
  { path: 'faq',               component: FaqComponent },
  { path: 'refund',            component: RefundComponent },
  { path: 'support',           component: SupportComponent },
  { path: 'partner',           component: PartnerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
