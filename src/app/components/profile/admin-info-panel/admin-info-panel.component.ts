import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

import { MetricsService, Metric } from '../../../services/metricsService/metrics.service';
import { ClickEvent }    from '../../../models/click-event.model';
import { CategoryEvent } from '../../../models/category-event.model';
import { KeywordEvent }  from '../../../models/keyword-event.model';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-info-panel',
  templateUrl: './admin-info-panel.component.html',
  styleUrls: ['./admin-info-panel.component.css'],
})
export class AdminInfoPanelComponent implements AfterViewInit, OnDestroy {
  @ViewChild('clicksChart',   { static: true }) clicksChartRef!:   ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryChart',{ static: true }) categoryChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('keywordChart', { static: true }) keywordChartRef!:  ElementRef<HTMLCanvasElement>;

  private subs = new Subscription();
  private clicksChart!:   Chart;
  private categoryChart!: Chart;
  private keywordChart!:  Chart;

  constructor(private metricsService: MetricsService) {}

  ngAfterViewInit(): void {
    this.renderClicksChart();
    this.renderCategoryChart();
    this.renderKeywordChart();
  }

  private renderClicksChart() {
    const sub = this.metricsService.getClickEvents()
      .subscribe((events: ClickEvent[]) => {
        const counts: Record<string, number> = {};
        events.forEach(evt => {
          const key = evt.productName;
          counts[key] = (counts[key] || 0) + 1;
        });
        const metrics: Metric[] = Object.entries(counts)
          .map(([label, value]) => ({ label, value }));

        this.createPieChart(
          this.clicksChartRef,
          'Product Clicks',
          metrics,
          chart => this.clicksChart = chart
        );
      });
    this.subs.add(sub);
  }

  private renderCategoryChart() {
    const sub = this.metricsService.getCategoryEvents()
      .subscribe((events: CategoryEvent[]) => {
        const counts: Record<string, number> = {};
        events.forEach(evt => {
          const key = evt.category;
          counts[key] = (counts[key] || 0) + 1;
        });
        const metrics: Metric[] = Object.entries(counts)
          .map(([label, value]) => ({ label, value }));

        this.createRadarChart(
          this.categoryChartRef,
          'Searches by Category',
          metrics,
          chart => this.categoryChart = chart
        );
      });
    this.subs.add(sub);
  }

  private renderKeywordChart() {
    const sub = this.metricsService.getKeywordEvents()
      .subscribe((events: KeywordEvent[]) => {
        const counts: Record<string, number> = {};
        events.forEach(evt => {
          const key = evt.keyword ?? 'UNKNOWN';
          counts[key] = (counts[key] || 0) + 1;
        });
        const metrics: Metric[] = Object.entries(counts)
          .map(([label, value]) => ({ label, value }));

        this.createDoughnutChart(
          this.keywordChartRef,
          'Searches by Keyword',
          metrics,
          chart => this.keywordChart = chart
        );
      });
    this.subs.add(sub);
  }

  private createRadarChart(
    canvasRef: ElementRef<HTMLCanvasElement>,
    label: string,
    data: Metric[],
    assign: (ch: Chart) => void
  ) {
    const values = data.map(d => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const bgColors = values.map(v =>
      v === max ? '#4caf50' :
      v === min ? '#f44336' :
      'rgba(63,81,181,0.4)'
    );
  
    const cfg: ChartConfiguration<'radar'> = {
      type: 'radar',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          label,
          data: values,
          backgroundColor: bgColors,
          borderColor: '#3f51b5',
          borderWidth: 2,
          pointBackgroundColor: bgColors,
          pointBorderColor: '#3f51b5',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: max,
            ticks: { stepSize: 1 }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    };
  
    const chart = new Chart(
      canvasRef.nativeElement.getContext('2d')!,
      cfg
    );
    assign(chart);
  }

  private createPieChart(
    canvasRef: ElementRef<HTMLCanvasElement>,
    label: string,
    data: Metric[],
    assign: (ch: Chart) => void
  ) {
    const values = data.map(d => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const bgColors = values.map(v =>
      v === max ? '#4caf50' :
      v === min ? '#f44336' :
      'rgba(63,81,181,0.6)'
    );

    const cfg: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          label,
          data: values,
          backgroundColor: bgColors
        }]
      },
      options: { responsive: true }
    };

    const chart = new Chart(
      canvasRef.nativeElement.getContext('2d')!,
      cfg
    );
    assign(chart);
  }

  private createDoughnutChart(
    canvasRef: ElementRef<HTMLCanvasElement>,
    label: string,
    data: Metric[],
    assign: (ch: Chart) => void
  ) {
    const values = data.map(d => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const bgColors = values.map(v =>
      v === max ? '#4caf50' :
      v === min ? '#f44336' :
      'rgba(63,81,181,0.6)'
    );

    const cfg: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          label,
          data: values,
          backgroundColor: bgColors
        }]
      },
      options: { responsive: true }
    };

    const chart = new Chart(
      canvasRef.nativeElement.getContext('2d')!,
      cfg
    );
    assign(chart);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.clicksChart?.destroy();
    this.categoryChart?.destroy();
    this.keywordChart?.destroy();
  }
}
