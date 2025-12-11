import axios from "axios";


const api = axios.create({
  baseURL: "https://clinic-f2fdc2951f89.herokuapp.com/api/",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

   
    const publicRoutes = ["login/", "refresh/"];

    const isPublic = publicRoutes.some((route) =>
      config.url.includes(route)
    );

    if (!isPublic && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href('/')
      
    }

    return Promise.reject(error);
  }
);
export default api;
