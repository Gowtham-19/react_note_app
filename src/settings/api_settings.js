import Api_Env from "../assets/env";

const api_settings = {
    CREATE_NOTE:Api_Env.API_URL+"createNote",
    GET_ALL_NOTES:Api_Env.API_URL+"getAllNotes",
    UPDATE_NOTE:Api_Env.API_URL+"updateNote",
    DELETE_NOTE:Api_Env.API_URL+"deleteNote",
    FILTER_NOTE:Api_Env.API_URL+"filterNotes",
}

export default api_settings;