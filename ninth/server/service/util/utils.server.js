export const getListTdTag = paragraph => {
    try {
        var regex = /[<][t][d][^>]+>[^<]+<\/td>/g;
        return paragraph.match(regex);
    } catch (e) {
        console.log("getListTdTag error", e);
        return [""];
    }
}

export const getListMiddleNumber = paragraph => {
    try {
        var regex = /([>]|[\s])[\d][^<]+</g;
        return paragraph.match(regex);
    } catch (e) {
        console.log("getListMiddleNumber error", e);
        return [""];
    }
}

export const getListNumberMoney = paragraph => {
    try {
        var regex = /[\d]+[^<]+/g;
        return paragraph.match(regex);
    } catch (e) {
        console.log("getListNumberMoney error", e);
        return [""];
    }
}

export const verifyNumberPhone = paragraph => {
    try {
        var regex = /[^0][\d]+/g;
        return paragraph.match(regex) + "";
    } catch (e) {
        console.log("verifyNumberPhone error", e);
        return [""];
    }
}
export const getListTdInformation = paragraph => {
    try {
        var regex = /[<][t][d][>][^<]+/g;
        return paragraph.match(regex);
    } catch (e) {
        console.log("get list td tag information error ", e);
        return [""];
    }
}

export const getTdInformation = paragraph => {
    try {
        var regex = /[^<td>]+/g;
        console.log("getTdInformation",paragraph);
        console.log("getTdInformation match",paragraph.match(regex));
        return paragraph.match(regex);
    } catch (e) {
        console.log()
    }
}

