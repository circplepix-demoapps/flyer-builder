import { AppSettings } from './../helpers/app.settings';
import { Observable } from 'rxjs/Rx';
import { Http, RequestOptions, Headers, Request, Response, RequestMethod } from '@angular/http';

/**
 * Base class implementation of api service 
 */
export class BaseApiService {
	private baseUrl = AppSettings.apiUrl;

	constructor(private http: Http) {
	}

	/**
	 * GET method operation (select)
	 * @param endpoint api url endpoint
	 */
	protected get(endpoint: string) {
		return this.request(endpoint, RequestMethod.Get);
	}

	/**
	 * POST method operation (insert)
	 * @param endpoint api url endpoint
	 * @param body request body
	 */
	protected post(endpoint: string, body: Object) {
		return this.request(endpoint, RequestMethod.Post, body);
	}

	/**
	 * PUT method operation (update)
	 * @param endpoint api url endpoint
	 * @param body request body
	 */
	protected put(endpoint: string, body: Object) {
		return this.request(endpoint, RequestMethod.Post, body);
	}

	/**
	 * 
	 * @param endpoint api url endpoint
	 */
	protected delete(endpoint: string) {
		return this.request(endpoint, RequestMethod.Delete);
	}

	/**
	 * 
	 * @param endpoint endpoint
	 * @param method  request method
	 * @param body request body
	 */
	private request(endpoint: string, method: RequestMethod, body?: Object) {
		const requestOptions: RequestOptions = new RequestOptions({
			url: `${this.baseUrl}${endpoint}`,
			method: method,
			headers: new Headers({
				'Content-Type': 'application/json'
			})
		})

		if (body) {
			requestOptions.body = body;
		}

		const request = new Request(requestOptions);

		return this.http.request(request);
	}

	//handle server error
	protected handleServerError(error: any) {
		return Observable.throw('An error occured while processing request.');
	}


}
