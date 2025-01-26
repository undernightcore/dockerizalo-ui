import { Injectable, inject } from '@angular/core';
import { SseClient } from 'ngx-sse-client';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';
import { BuildInterface } from '../../interfaces/build.interface';
import { HttpClient } from '@angular/common/http';
import { MessageInterface } from '../../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class BuildsService {
  #http = inject(HttpClient);
  #sse = inject(SseClient);

  createBuild(appId: string) {
    return this.#http.post<BuildInterface>(
      `${environment.apiUrl}/apps/${appId}/builds`,
      {}
    );
  }

  getBuilds(appId: string) {
    return this.#sse
      .stream(`${environment.apiUrl}/apps/${appId}/builds/realtime`, {
        keepAlive: true,
        responseType: 'text',
      })
      .pipe(
        map(
          (builds) =>
            JSON.parse(builds) as Omit<
              BuildInterface,
              'appId' | 'updatedAt' | 'log'
            >[]
        )
      );
  }

  getBuild(appId: string, buildId: string) {
    return this.#sse
      .stream(
        `${environment.apiUrl}/apps/${appId}/builds/${buildId}/realtime`,
        {
          keepAlive: true,
          responseType: 'text',
        }
      )
      .pipe(map((builds) => JSON.parse(builds) as BuildInterface));
  }

  cancelBuild(appId: string, buildId: string) {
    return this.#http.post<MessageInterface>(
      `${environment.apiUrl}/apps/${appId}/builds/${buildId}/cancel`,
      {}
    );
  }
}
