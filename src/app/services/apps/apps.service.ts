import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AppInterface } from '../../interfaces/app.interface';

@Injectable({
  providedIn: 'root',
})
export class AppsService {
  #http = inject(HttpClient);

  getApps() {
    return this.#http.get<AppInterface[]>(`${environment.apiUrl}/apps`);
  }
}
