import { Component, Input } from '@angular/core';
import { MoneyPipe } from '../shared/money.pipe';

@Component({
  selector: 'app-portfolio-summary',
  imports: [MoneyPipe],
  templateUrl: './portfolio-summary.html',
  styleUrl: './portfolio-summary.scss',
})
export class PortfolioSummaryComponent {
  @Input({ required: true }) vehicleCount = 0;
  @Input({ required: true }) totalInvestmentCents = 0;
  @Input({ required: true }) totalTargetMarginCents = 0;
}
