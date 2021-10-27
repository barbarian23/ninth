import React, { useState, useEffect, useRef } from "react";
import '../../assets/css/home/home.css';
import { TH_STT, TH_PHONE, TH_MONEY, TH_INFO, TH_TRACK, TR_TYPE_NUMBER, TR_TYPE_MONEY, TR_TYPE_ADD, sampleData } from "../../constants/home/home.constant";
import { ADD_PHONE, GET_LIST_PHONE, SEARCH_PHONE, SET_INTERVAL_PHONE } from "../../action/home/home.action";
import { readFileExcel, createFileExcel } from "../../service/excel/excel.client.service";
import { useSelector, useDispatch } from 'react-redux';

import Row from './row.home.screen';
import { validatePhonenumber } from "../../service/util/utils.client";

export default function Home() {
    const [phone, setPhone] = useState("");
    const [money, setMoney] = useState(0);
    const [warningPhone, setWarningPhone] = useState("");

    const dispatch = useDispatch();

    let listPhone = useSelector(state => state.home.listPhone);
    let warning = useSelector(state => state.home.warning);
    let notiPhone = useSelector(state => state.home.notiPhone);

    useEffect(() => {
        console.log("current list phone", listPhone);
        if (listPhone.length === 0) {
            dispatch({ type: GET_LIST_PHONE, data: null });
        }
        // khoi tao interval - duy nhat 1 lan
        dispatch({ type: SET_INTERVAL_PHONE });
    }, []);

    let readFile = (e) => {
        readFileExcel(e.target.files[0], (data) => {
            //data là mảng chứa danh sách thuê bao và số tiền
            data.forEach((item, index) => {
                //Bỏ qua dòng đầu vì là tiêu đề

                if (index > 0) {
                    console.log("data in file excel", item);
                    // useDispatch({ type: ADD_PHONE, value: item });
                    dispatch({ type: ADD_PHONE, data: { phone: item[0], money: item[1] } });
                }
            });
        });

        //phải cần dòng dưới, vì nếu như lần thứ hai chọn cùng 1 file, sẽ không được tính là opnchange, hàm onchange sẽ không gọi lại
        e.target.value = null;
    }

    let downloadFile = (e) => {
        createFileExcel(sampleData);
    }

    let onInputPhone = (e) => {
        setPhone(e.target.value);
        if (!validatePhonenumber(phone))
            setWarningPhone("Số điện thoại không hợp lệ");
        else
            setWarningPhone("");
    }

    let onInputMoney = (e) => {
        setMoney(e.target.value);
    }

    let onInputSearch = (e) => {
        if (e.target.value == "") {
            dispatch({
                type: SEARCH_PHONE,
                data: -1
            }
            )
        } else {
            if (listPhone) {
                listPhone.forEach((element, index) => {
                    //console.log("element is", element);
                    if (element.phone.includes(e.target.value)) {
                        //console.log("found", index);
                        dispatch({
                            type: SEARCH_PHONE,
                            data: index,
                        })
                        //inputSearch.current.focus();
                    }
                });
            }
        }
    }

    let addNew = () => {
        dispatch({ type: ADD_PHONE, data: { phone: phone, money: money } });
    }

    return (
        <div className="crawl-login" id="div_craw">
            <div className="input-add-div">
                <input className="input-add"
                    type="text" placeholder="Nhập số cần tìm" onChange={onInputSearch} />
            </div>
            <div className="crawl-login-crawl">
                <table>
                    <tbody>
                        <tr>
                            <th>{TH_STT}</th>
                            <th>{TH_PHONE}</th>
                            <th>{TH_MONEY}</th>
                            <th>{TH_INFO}</th>
                            <th>{TH_TRACK}</th>
                        </tr>
                        {
                            listPhone
                                ? listPhone.map((item, index) => {
                                    // console.log(index, item);
                                    return <Row key={index}
                                        data={item}
                                        index={index}
                                    />
                                })
                                : null
                        }
                    </tbody>
                </table>

                <div className="divTextStatus"></div>

                <div className="input-add-div">
                    <input className="input-add"
                        type="text"
                        placeholder={TR_TYPE_NUMBER}
                        onChange={onInputPhone}
                    />
                    <input className="input-add" type="text" placeholder={TR_TYPE_MONEY} onChange={onInputMoney} />
                    <input className="input-add-button" type="button" value={TR_TYPE_ADD} onClick={addNew} />
                    {
                        warning == "" ?
                            <div>{warningPhone}</div>
                            :
                            <div>{warning}</div>
                    }
                </div>
                <div>
                </div>
                <div id="crawl_login_file_input_up">
                    {/* <img id="img_file_input" src='../assets/images/file.png' /> */}
                    <label htmlFor="xlsx">Bấm vào đây để chọn tệp(excel)</label>
                    <input type="file"
                        id="xlsx" name="xlsx"
                        accept="xlsx" onChange={readFile} />
                    <span id="span_file_input_error"></span>
                </div>

                <div id="crawl_login_file_input_down" onClick={downloadFile} >
                    {/* <img id="img_file_input" src='../assets/images/file.png' /> */}
                    <label htmlFor="avatar">Bấm vào đây để tải tệp(excel) mẫu</label>
                </div>
                {
                    notiPhone && notiPhone.length > 0 ?
                        <div className="div-noti-phone-parent">
                            <span id="span-noti-phone">Thay đổi mới nhất</span>
                            <div className="div-noti-phone">{
                               notiPhone ? notiPhone.map((item, index) => {
                                    //console.log("thay doi moi nhat",index, item);
                                    return <text>Tài khoản chính của thuê bao <span className="noti-item-phone">{item.phone}</span> là <span className="noti-item-">{item.info}</span> (lớn hơn {item.money})</text>
                                })
                                :
                                null
                            }
                            </div>
                        </div>
                        :
                        null
                }

                
                <div className="div-progress-bar" id="div_progress_bar">
                    <div id="div_grey"></div>
                </div>
                <h4 id="success_text"></h4>
                <h4 id="error_crawl"></h4>
            </div>
        </div>
    );

}