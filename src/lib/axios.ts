import http, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { redirect } from "next/navigation";
http.defaults.baseURL = process.env.NEXT_PUBLIC_AXIOS_BASE_URL;
http.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (response.status == 401) {
      sessionStorage.removeItem("currentUser");
      sessionStorage.removeItem("accessToken");
      redirect("/auth/login");
    }
    return response;
  },
  (error: AxiosError) => {
    const { data, status, config } = error.response!;
    console.log(error.response!);
    if (status == 401) {
      sessionStorage.removeItem("currentUser");
      sessionStorage.removeItem("accessToken");
      redirect("/auth/login");
    }
  }
);
http.interceptors.request.use((request): InternalAxiosRequestConfig => {
  const accessToken = sessionStorage.getItem("accessToken");
  if (accessToken) {
    request.headers.Authorization = "Bearer " + JSON.parse(accessToken);
  }
  return request;
});
export default http;
