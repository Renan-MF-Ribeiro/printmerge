import { Injectable } from '@angular/core';
import { SubscriptionLevel } from '../enums/subscription-level.enum';

@Injectable({ providedIn: 'root' })
export class FeatureGateService {
  private currentLevel = SubscriptionLevel.FREE;

  canAccess(_feature: string): boolean {
    return true;
  }

  getLevel(): SubscriptionLevel {
    return this.currentLevel;
  }
}
