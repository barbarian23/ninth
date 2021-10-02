import readXlsxFile from 'read-excel-file';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

/**
 * 
 * @param {*} file là file
 * @param {*} callback là hàm sẽ nhận lại kết quả trong file excel tải lên
 */
export function readFileExcel(file, callback) {
    // console.log(file);
    readXlsxFile(file).then((rows) => {
        // console.log(rows);
        callback(rows);
    })
}


export async function createFileExcel(sample) {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const ws = XLSX.utils.json_to_sheet(sample);
    const wb = { Sheets: { 'Số điện thoại': ws }, SheetNames: ['Số điện thoại'] };

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "Mẫu" + fileExtension);
}