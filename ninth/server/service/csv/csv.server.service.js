


function csvService() {
    const csvFilePath = './server/data/data.csv';

    function readFile() {
        const csv = require('csv-parser');
        const fs = require('fs');
        let data = [];

        try {
            fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                data.push(row);
            })
            .on('end', () => {
                console.log('The CSV file successfully processed');
            })
        }catch(err) {
            throw err;
        }

        return data;
    }

    function writeFile(data) {
        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        const csvWriter = createCsvWriter({
          path: csvFilePath,
          header: [
            {id: 'phone', title: 'phone'},
            {id: 'money', title: 'money'},
            {id: 'info', title: 'info'},
          ]
        });

        csvWriter
            .writeRecords(data)
            .then(()=> console.log('The CSV file was written successfully'));
    }

    
    let csv = {
        readFile: readFile,
        writeFile: writeFile,
    }

    return csv;
}

export default csvService;