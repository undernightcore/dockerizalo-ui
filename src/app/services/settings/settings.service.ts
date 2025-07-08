import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SettingInterface } from '../../interfaces/setting.interface';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  #http = inject(HttpClient);

  getSettings() {
    return this.#http.get<SettingInterface[]>(`${environment.apiUrl}/settings`);
  }

  editSetting(id: string, value: number | string | boolean) {
    return this.#http.put<SettingInterface>(
      `${environment.apiUrl}/settings/${id}`,
      { value }
    );
  }
}
