import api_settings from "../settings/api_settings";
import http from "../interceptor";

const api_services = {
      getAllNotes(){
        http.get(api_settings.GET_ALL_NOTES).then(res => {
             res=res["data"]
        }).catch(err => {
             err=err
        })
      }
}

export default api_services;