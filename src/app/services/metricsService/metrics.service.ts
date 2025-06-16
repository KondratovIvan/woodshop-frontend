import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ClickEvent } from '../../models/click-event.model';
import { CategoryEvent } from '../../models/category-event.model';
import { KeywordEvent } from '../../models/keyword-event.model';
import { environment } from '../../../environments/environment';


export interface Metric {
  label: string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  
  private baseUrl = environment.pageEventService;

  constructor(private http: HttpClient) {}

  getClickEvents(): Observable<ClickEvent[]> {
    return this.http.get<ClickEvent[]>(
      `${this.baseUrl}/api/metrics/clicks`
    );
  }

  getCategoryEvents(): Observable<CategoryEvent[]> {
    return this.http.get<CategoryEvent[]>(
      `${this.baseUrl}/api/metrics/categories`
    );
  }

  getKeywordEvents(): Observable<KeywordEvent[]> {
    return this.http.get<KeywordEvent[]>(
      `${this.baseUrl}/api/metrics/keywords`
    );
  }
}
