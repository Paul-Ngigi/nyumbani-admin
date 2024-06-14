export function processHttpErrors(err: any) {
  console.log({ err });

  // If the error is an AxiosError
  if (err.isAxiosError) {
    const axiosError = err;

    // Handle specific error status codes
    if (axiosError.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = axiosError.response.status;
      const data = axiosError.response.data;

      if (status === 543) {
        return 543;
      }

      // Check for Payload in the response data
      if (data && data.Payload) {
        if (typeof data.Payload === "string") {
          return data.Message || data.Payload;
        }
      } else {
        return `Status (${status}) : ${axiosError.response.statusText}`;
      }
    } else if (axiosError.request) {      
      return `No response received: ${axiosError.message}`;
    } else {      
      return `Error: ${axiosError.message}`;
    }
  }

  
  let e = err.error;
  if (err.status === 543) {
    return 543;
  } else if (e && e.hasOwnProperty("Payload")) {
    if (typeof e.Payload === "string") {
      return e.Message;
    }
  } else {
    if (e?.code) {
      return `Status (${e?.code}) : ${e?.message} ${e.error}`;
    } else {
      return `Status (${err.status}) : ${err.statusText}`;
    }
  }
}
