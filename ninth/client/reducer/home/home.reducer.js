import {
    GET_LENGHT_LIST,
    GET_NUMBER_INFORMATION,
    GET_NUMBER_INFORMATION_SUCCESS,
    START_CRAWL_DATA,
} from '../../action/home/home.action';

const initialState = {
    something: undefined,
    listPhone: [],
    phoneNumberChecking: {
        index: "",
        phone: "",
    },
    sumIndex: "",
    isCrawlDone: true
};

export default function homeReducer(state = initialState, action) {
    // console.log("[homeReducers " + action.type + "]", action.value);

    switch (action.type) {
        case GET_LENGHT_LIST:
            console.log("sum index", action.data.sumIndex);
            let tempIndex = { ...state.sumIndex };
            tempIndex = action.data.sumIndex;
            return {
                ...state,
                sumIndex: (tempIndex - 1),
            }
        case START_CRAWL_DATA: // gửi listPhone sang server để crawl
            let tempList = [...state.listPhone];
            tempList = action.data.listPhone;
            return {
                ...state,
                listPhone: tempList,
            }
        // nhan reponse tu server
        // nhan ve: index, phone da crawl xong tu server
        // can xem lai
        case GET_NUMBER_INFORMATION:
            console.log("phone ", action.data.index, " ", action.data.phone);
            let tempNumber = { ...state.phoneNumberChecking };
            tempNumber.index = action.data.index;
            tempNumber.phone = action.data.phone;
            return {
                ...state,
                phoneNumberChecking: tempNumber,
            }
        case GET_NUMBER_INFORMATION_SUCCESS:
            return {
                ...state,
                isCrawlDone: action.data,
                listPhone: []
            }
        default:
            return {
                ...state
            }
    }
}