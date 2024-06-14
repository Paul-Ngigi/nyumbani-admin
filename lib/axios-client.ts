import axios from "axios";
import { getSession } from "next-auth/react";

const baseURL = '/api';

const ApiClient = () => {
  const defaultOptions = {
    baseURL,
  };

  const instance = axios.create(defaultOptions);

  instance.interceptors.request.use(async (request) => {
    const session = await getSession();    
    if (session) {
      request.headers.set("Content-Type", "application/json");
      request.headers.set("skey", session.jwt);
    }
    return request;
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(`error`, error);
      return Promise.reject(error);
    }
  );

  return instance;
};

export default ApiClient();
