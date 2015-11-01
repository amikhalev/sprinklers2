import {addAlert} from '../actions/alerts.js';

class RequestError extends Error {
  constructor(error) {
    super();
    this.name = error.statusText;
    this.message = error.message;
    this.status = error.status;
    this.data = error.data;
  }
}

function noop() {
}

export const FetchApiMixin = {
  fetchHandlers({errorMessage, action = null, dataHandler = noop}) {
    let {completed, failed} = (action == null) ? {} : action;
    return {
      onSuccess: (response) => (
        response.json()
          .then(json => {
            if (!response.ok) {
              throw new RequestError(json);
            } else {
              dataHandler(json.data, (completed || noop));
              return json;
            }
          })
      ),
      onError: (error) => {
        addAlert('danger', `${errorMessage}: ${error}`);
        (failed || noop)(error);
        throw error;
      }
    };
  }
};

export const StateMixin = {
  getInitialState() {
    return this.getState();
  },

  stateUpdated() {
    this.trigger(this.getState());
  }
};
