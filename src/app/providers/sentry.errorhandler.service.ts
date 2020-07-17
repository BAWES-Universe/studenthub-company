import { ErrorHandler, Injectable } from '@angular/core';
import * as Raven from 'raven-js';
import { environment } from '../../environments/environment';


@Injectable({
	providedIn: 'root'
})
export class SentryErrorhandlerService extends ErrorHandler {

	// Should we log to sentry or not?
	public sentryLoggingEnabled = false;

	// Array of environments to log
	public environmentsLogged: string[] = ["dev", "prod"];

	constructor() {
		super();

		// Enable sentry logging if current environment is in list of environments to log
		if(this.environmentsLogged.indexOf(environment.envName) > -1) {
			// Enable sentry logging
			this.sentryLoggingEnabled = true;

			// Initialize error logger with this environment name

			Raven
			    .config('https://7d4f6518641748b8935291e9057883b5@o70039.ingest.sentry.io/5339283', {
					environment: environment.envName
				}).install();
		}
	}

	handleError(error) {
        super.handleError(error);

		const chunkFailedMessage = /Loading chunk [\d]+ failed/;

		if (chunkFailedMessage.test(error.message)) {
		  window.location.reload();
		}

		// Exit function if sentry logging is not enabled
		if(!this.sentryLoggingEnabled) return;

		// Capture error through Sentry
        try {
          Raven.captureException(error.originalError || error);
        }
        catch(e) {
          console.error(e);
        }
    }
}
