export const getListTdTag = paragraph => {
    try {
        var regex = /[<][t][d][^>]+>[^<]+<\/td>/g;
        return paragraph ? paragraph.match(regex) : "";
    } catch (e) {
        console.log("getListTdTag error",e);
        return [""];
    }
}

export const getListMiddleNumber = paragraph => {
    try {
        var regex = /([>]|[\s])[\d][^<]+</g;
        return paragraph ? paragraph.match(regex) : "";
    } catch (e) {
        console.log("getListMiddleNumber error",e);
        return [""];
    }
}

export const getListNumberMoney = paragraph => {
    try {
        var regex = /[\d]+[^<]+/g;
        return paragraph ? paragraph.match(regex) : "";
    } catch (e) {
        console.log("getListNumberMoney error",e);
        return [""];
    }
}

export const verifyNumberPhone = paragraph => {
    try {
        var regex = /[^0][\d]+/g;
        return paragraph.match(regex);
    } catch (e) {
        console.log("verifyNumberPhone error",e);
        return [""];
    }
}