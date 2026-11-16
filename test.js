import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 100, // 100 virtual users
  duration: "30s",
};

export default function () {
  http.get("https://pragatiai.onrender.com/api/health");
  sleep(1);
}