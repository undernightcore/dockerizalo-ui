import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AppInterface } from '../../interfaces/app.interface';
import { SseClient } from 'ngx-sse-client';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppsService {
  #http = inject(HttpClient);
  #sse = inject(SseClient);

  getApps() {
    return this.#http.get<AppInterface[]>(`${environment.apiUrl}/apps`);
  }

  getApp(appId: string) {
    return this.#sse
      .stream(`${environment.apiUrl}/apps/${appId}/realtime`, {
        keepAlive: true,
        responseType: 'text',
      })
      .pipe(map((json) => JSON.parse(json) as AppInterface));
  }
}
