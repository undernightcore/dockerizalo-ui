import { Injectable, inject } from '@angular/core';
import { SseClient } from 'ngx-sse-client';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';
import { BuildInterface } from '../../interfaces/build.interface';

@Injectable({
  providedIn: 'root',
})
export class BuildsService {
  #sse = inject(SseClient);

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

  getBuildLogs(appId: string, buildId: string) {
    return this.#sse
      .stream(
        `${environment.apiUrl}/apps/${appId}/builds/${buildId}/realtime`,
        {
          keepAlive: true,
          responseType: 'text',
        }
      )
      .pipe(
        map((builds) => JSON.parse(builds) as BuildInterface),
        map(({ log }) => log)
      );
  }
}
