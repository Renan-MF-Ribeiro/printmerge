import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RewardUnlockService {
  watchAd(_feature: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  checkUnlocked(_feature: string): boolean {
    return true;
  }
}
