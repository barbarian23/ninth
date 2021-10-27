import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DELETE_PHONE, EDIT_PHONE, NOTI_PHONE, SET_INTERVAL_PHONE } from "../../action/home/home.action";
import '../../assets/css/home/row.css';
import mp3 from '../../assets/sound/noti.mp3';
import { TH_EDIT, TH_DELETE, TH_DONE, URL_BOT_TELEGRAM, ID_CHANNEL_TELEGRAM } from "../../constants/home/home.constant";
import { requestPost } from "../../service/request/request.js";

export default function Row(props) {
    const { index, data } = props;
    const { phone, money, info } = data;

    //lấy ra giá trị trước của info
    const prevInfo = usePrevious(info);

    //giá trị hiện tại của info
    let [currentInfo, setCurrentInfo] = useState(false);

    let sendTelegram = (data) => {
        requestPost(URL_BOT_TELEGRAM,
            {
                chat_id: ID_CHANNEL_TELEGRAM,
                text: "Tài khoản chính của thuê bao " + data.phone + " là " + data.info + " (lớn hơn " + data.money + ")",
            }, (res) => {
                console.log("send telegram successfully ", "Tài khoản chính của thuê bao " + data.phone + " là " + data.info + " (lớn hơn " + data.money + ")");
            },
            (err) => {
                console.log("send telegram failure ", err);
            });
    }

    //check giá trị khi info thay đổi
    useEffect(() => {
        //nếu là -1 , có lẽ lỗi mạng cmnr
        //console.log("phone", phone, "new info", info);
        if (Number.parseFloat(info) == -1) {
            //không có giá trị trước của prevInffo - lần đậ chạy àm lỗi mạng

            if (prevInfo == null || prevInfo == "") {
                setCurrentInfo("Bị lỗi số");
            }
            //thì set lại gái trị cuối cùng vừa nhận được
            else {
                setCurrentInfo(prevInfo);
            }
        }
        if (info == null) {
            setCurrentInfo("Bị lỗi số");
        }
        //nếu không phải -1 , không phải lỗi
        else {
            setCurrentInfo(info);
            if (Number.parseFloat(info) >= Number.parseFloat(money)) {
                dispatch({
                    type: NOTI_PHONE,
                    data: {
                        phone: phone,
                        money: money,
                        info: info,
                    }
                });
                sendTelegram(data);
            }

        }
    }, [info]);

    let searchPhone = useSelector(state => state.home.searchPhone);
    const makeColor = useRef(null);
    useEffect(() => {
        //console.log("makeColor", makeColor);
    }, [makeColor]);
    const inputSearch = useRef(null);
    useEffect(() => {
        //console.log("inputSearch", inputSearch);
    }, [inputSearch]);

    useEffect(() => {
        if (searchPhone == -1 && index == 0) {
            inputSearch.current.scrollIntoView(true);
            makeColor.current.style.color = 'black';
        } else if (searchPhone == index) {
            inputSearch.current.scrollIntoView(true);
            makeColor.current.style.color = 'red';
        } else if (searchPhone != index) {
            makeColor.current.style.color = 'black';
        }
    }, [searchPhone]);

    const [audio] = useState(new Audio(mp3));

    let dispatch = useDispatch();
    let dispatchToStore = (action) => {
        dispatch(action);
    }

    // console.log('row data', data);

    //khi bấm edit
    let [isEdited, setEdited] = useState(false);

    //số điện thoại
    let [newPhone, setNewPhone] = useState(phone);
    let [newMoney, setNewMoney] = useState(money);

    let editPhone = () => {
        //playSound();
        isEdited ? setEdited(false) : setEdited(true);
    }

    let onChangePhone = (e) => {
        //console.log("row phone screen - e = ", e.target.value, "old data");
        if (e.target.value != null || e.target.value != undefined)
            setNewPhone(e.target.value);
        else
            setNewPhone(phone);
    }

    let onChangeMoney = (e) => {
        if (e.target.value != null || e.target.value != undefined)
            setNewMoney(e.target.value);
        else
            setNewMoney(money);
    }

    let playSound = () => {
        audio.play()
    }


    // useEffect(() => {
    //     if (Number.parseFloat(data.info) >= Number.parseFloat(data.money)) {
    //         // playSound();
    //         sendTelegram(data);
    //     }
    // }, [data.info]);

    if (!isEdited) {
        return (
            <tr ref={inputSearch} style={{ backgroundColor: (Number.parseFloat(data.info) >= Number.parseFloat(data.money)) ? "#00FF00" : "#FFFFFF" }} key={index}>
                <td>{index + 1}</td>
                <td ref={makeColor} >{phone}</td>
                <td>{money}</td>
                <td>{currentInfo}
                    {/* {playSound(Number.parseFloat(data.info))} */}
                </td>
                <td>
                    <div className="btn edit" onClick={editPhone}>{TH_EDIT}</div>
                    <div className="btn delete" onClick={() => dispatchToStore({ type: DELETE_PHONE, data: { index: index, phone: phone, money: money, info: info } })}>{TH_DELETE}</div>
                </td>
            </tr>
        )
    } else {
        return (
            <tr key={index}>
                <td>{index + 1}</td>
                <td><input type="text" placeholder="Nhập số điện thoại" onChange={onChangePhone} defaultValue={phone} /></td>
                <td><input type="text" placeholder="Nhập số tiền" onChange={onChangeMoney} defaultValue={money} /></td>
                <td style={{ backgroundColor: (Number.parseFloat(data.info) >= Number.parseFloat(data.money)) ? "#00FF00" : "#FFFFFF" }}>{currentInfo}</td>
                <td>
                    <div className="done"
                        onClick={() => {
                            editPhone();
                            dispatchToStore({
                                type: EDIT_PHONE,
                                data: { index: index, phone: newPhone, money: newMoney, info: info }
                            });
                        }}>{TH_DONE}</div></td>
            </tr>
        )

    }

}

//dùng để lấy giá trị state haowjc prop trước khi đổi
function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}