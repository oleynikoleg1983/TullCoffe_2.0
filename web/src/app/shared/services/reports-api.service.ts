import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalesReportDetailRow, SalesReportRow } from '../models/sales-report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportsApiService {
  constructor(private readonly http: HttpClient) {}

  getSalesReport(from: string, to: string): Observable<SalesReportRow[]> {
    const params = new HttpParams().set('from', from).set('to', to);

    return this.http.get<SalesReportRow[]>('/api/admin/reports/sales', { params });
  }

  getSalesReportDetails(from: string, to: string): Observable<SalesReportDetailRow[]> {
    const params = new HttpParams().set('from', from).set('to', to);

    return this.http.get<SalesReportDetailRow[]>('/api/admin/reports/sales/details', { params });
  }
}
