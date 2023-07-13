import axios from "axios";

export default class Service {
    protected http;
  constructor() {
     this.http = axios.create({
      baseURL: process.env.APP_URL,
      // headers: {
      //   Authorization:
      //     "Bearer "+process.env.ACCESS_TOKEN,
      // },
    });
  }
}
