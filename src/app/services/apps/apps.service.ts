import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SseClient } from 'ngx-sse-client';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AppFromTemplateRequestInterface,
  AppInterface,
} from '../../interfaces/app.interface';
import { BuildInterface } from '../../interfaces/build.interface';
import { MessageInterface } from '../../interfaces/message.interface';

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

  getAppLogs(appId: string, tail?: number) {
    return this.#sse
      .stream(
        `${environment.apiUrl}/apps/${appId}/logs/realtime`,
        {
          keepAlive: true,
          responseType: 'text',
        },
        { params: tail ? { tail: String(tail) } : undefined }
      )
      .pipe(map((json) => JSON.parse(json) as string));
  }

  getAppDeploymentLogs(appId: string) {
    return this.#sse
      .stream(`${environment.apiUrl}/apps/${appId}/deployment/logs/realtime`, {
        keepAlive: true,
        responseType: 'text',
      })
      .pipe(map((json) => JSON.parse(json) as string | null));
  }

  createApp(app: Omit<AppInterface, 'id' | 'status'>) {
    return this.#http.post<AppInterface>(`${environment.apiUrl}/apps`, app);
  }

  createAppFromTemplate(app: AppFromTemplateRequestInterface) {
    return this.#http.post<AppInterface>(
      `${environment.apiUrl}/apps/template`,
      app
    );
  }

  updateApp(appId: string, app: Omit<AppInterface, 'id' | 'status'>) {
    return this.#http.put<AppInterface>(
      `${environment.apiUrl}/apps/${appId}`,
      app
    );
  }

  startApp(appId: string) {
    return this.#http.post<MessageInterface | BuildInterface>(
      `${environment.apiUrl}/apps/${appId}/start`,
      {}
    );
  }

  stopApp(appId: string) {
    return this.#http.post<MessageInterface>(
      `${environment.apiUrl}/apps/${appId}/stop`,
      {}
    );
  }

  deleteApp(appId: string, force: boolean) {
    return this.#http.delete<MessageInterface>(
      `${environment.apiUrl}/apps/${appId}?force=${force}`,
      {}
    );
  }
}
