import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, finalize } from 'rxjs';
import {
  SalesReportDetailRow,
  SalesReportRow,
} from '../../../shared/models/sales-report.model';
import { ReportsApiService } from '../../../shared/services/reports-api.service';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [FormsModule, DecimalPipe, DatePipe],
  templateUrl: './admin-reports.component.html',
  styleUrl: './admin-reports.component.less',
})
export class AdminReportsComponent implements OnInit {
  private readonly reportsApiService = inject(ReportsApiService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly rowsSubject = new BehaviorSubject<SalesReportRow[]>([]);
  private readonly detailsSubject = new BehaviorSubject<SalesReportDetailRow[]>([]);

  from = this.getToday();
  to = this.getToday();
  rows = toSignal(this.rowsSubject.asObservable(), { initialValue: [] });
  details = toSignal(this.detailsSubject.asObservable(), { initialValue: [] });
  loading = false;
  detailsLoading = false;
  showDetails = false;
  selectedSeller = '';
  error = '';
  detailsError = '';

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    if (!this.from || !this.to || this.from > this.to) {
      this.error = 'Choose a valid date range.';
      this.rowsSubject.next([]);
      return;
    }

    this.loading = true;
    this.error = '';

    this.reportsApiService
      .getSalesReport(this.from, this.to)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetector.detectChanges();
        }),
      )
      .subscribe({
        next: (rows) => {
          this.rowsSubject.next(rows);
          this.changeDetector.detectChanges();
        },
        error: () => {
          this.rowsSubject.next([]);
          this.error = 'Could not load the report.';
          this.changeDetector.detectChanges();
        },
      });

    if (this.showDetails) {
      this.loadDetails();
    }
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;

    if (this.showDetails) {
      this.loadDetails();
    }
  }

  private loadDetails(): void {
    if (!this.from || !this.to || this.from > this.to) {
      this.detailsError = 'Choose a valid date range.';
      this.detailsSubject.next([]);
      return;
    }

    this.detailsLoading = true;
    this.detailsError = '';

    this.reportsApiService
      .getSalesReportDetails(this.from, this.to)
      .pipe(
        finalize(() => {
          this.detailsLoading = false;
          this.changeDetector.detectChanges();
        }),
      )
      .subscribe({
        next: (rows) => {
          this.detailsSubject.next(rows);
          this.changeDetector.detectChanges();
        },
        error: () => {
          this.detailsSubject.next([]);
          this.detailsError = 'Could not load the detailed report.';
          this.changeDetector.detectChanges();
        },
      });
  }

  get sellerOptions(): SalesReportRow[] {
    return this.rows().slice().sort((first, second) =>
      first.userName.localeCompare(second.userName),
    );
  }

  get filteredRows(): SalesReportRow[] {
    if (!this.selectedSeller) {
      return this.rows();
    }

    return this.rows().filter((row) => row.userName === this.selectedSeller);
  }

  get filteredDetails(): SalesReportDetailRow[] {
    if (!this.selectedSeller) {
      return this.details();
    }

    return this.details().filter((row) => row.sellerName === this.selectedSeller);
  }

  private getToday(): string {
    return this.toDateOnly(new Date());
  }

  private toDateOnly(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
