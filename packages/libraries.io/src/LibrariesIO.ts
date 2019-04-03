import {APIClient, AxiosConfigWithData} from '@ffflorian/api-client';
import {GitHubRepositoryAPI, GitHubUserAPI, PlatformAPI, ProjectAPI, UserAPI} from './api';
import {API, ClientOptions, RequestOptions} from './interfaces/';

export class LibrariesIO {
  public readonly api: API;
  private readonly apiClient: APIClient<RequestOptions>;
  private readonly options: ClientOptions;

  constructor(apiKey: string);
  constructor(options: ClientOptions);
  constructor(options: ClientOptions | string) {
    if (typeof options === 'string') {
      options = {apiKey: options};
    }

    this.options = options;

    const requestInjector = (config: AxiosConfigWithData<RequestOptions>) => {
      config.data = {
        ...config.data,
        api_key: this.options.apiKey,
      };
      return config;
    };

    // const responseInjector = (response: AxiosResponseWithoutData<LibrariesIOHeaders>) => {
    //   const headers = response.headers;
    //   const contentType = headers['content-type'] ? String(headers['content-type']) : undefined;
    //   const rateLimit = Number(headers['x-ratelimit-limit']);
    //   const rateLimitRemaining = Number(headers['x-ratelimit-remaining']);
    //   const totalResults = headers['total'] ? Number(headers['total']) : undefined;
    //   return {...response, d: 2}
    // }

    this.apiClient = new APIClient({
      apiUrl: 'https://libraries.io/api',
      requestInjector,
    });

    this.api = {
      github: {
        repository: new GitHubRepositoryAPI(this.apiClient),
        user: new GitHubUserAPI(this.apiClient),
      },
      platform: new PlatformAPI(this.apiClient),
      project: new ProjectAPI(this.apiClient),
      user: new UserAPI(this.apiClient),
    };
  }

  /*

      const contentType = headers['content-type'] ? String(headers['content-type']) : undefined;
      const rateLimit = Number(headers['x-ratelimit-limit']);
      const rateLimitRemaining = Number(headers['x-ratelimit-remaining']);
      const totalResults = headers['total'] ? Number(headers['total']) : undefined;
  */

  /**
   * Set a new API URL.
   * @param newUrl The new API url
   */
  public setApiUrl(newUrl: string): void {
    this.apiClient.setApiUrl(newUrl);
  }

  /**
   * Set a new API key.
   * @param apiKey The new API key
   */
  public setApiKey(apiKey: string): void {
    this.options.apiKey = apiKey;
  }
}