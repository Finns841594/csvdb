import * as fs from 'fs';
import * as fastcsv from 'fast-csv';

let data1: any[] = [];
let data2: any[] = [];

const keyColumn = 'Origin URL';
const file1 = 'Room Details List-Grid view.csv'
const file2 = 'Captured Texts-Grid view.csv'

fs.createReadStream(file1)
  .pipe(fastcsv.parse({ headers: true }))
  .on('data', (row) => {
    data1.push(row);
  })
  .on('end', () => {
    // Parsing second CSV file after the first has completed
    console.log('data1 length', data1.length, '\n ⭐️⭐️⭐️ data1 headers', '\n' , Object.keys(data1[0]), );
    fs.createReadStream(file2)
        .pipe(fastcsv.parse({ headers: true }))
        .on('data', (row) => {
            data2.push(row);
        })
        .on('end', () => {
          console.log('data2️⃣ length', data2.length, '\n ⭐️⭐️⭐️ data2️⃣ headers', '\n' , Object.keys(data2[0]), );
          // Join the data based on the key column
          let joinedData = joinData(data1, data2, keyColumn);
          console.log('⭐️Results', '\n', '\n joined data headers', Object.keys(joinedData[0]),);
          // Write the results to a new CSV file
          // fastcsv.write(joinedData, { headers: true }).pipe(fs.createWriteStream('output.csv'));
        });
});

function joinData(data1: any[], data2: any[], keyColumn: string) {
  let result: any[] = [];
  // console.log('data1', '\n', data1);

    // Loop through the first dataset
    data1.forEach(row1 => {
        // Find matching rows in the second dataset
        let matchingRows = data2.filter(row2 => row1[keyColumn] === row2[keyColumn]);

        // If there are matching rows, combine them with the current row
        if (matchingRows.length > 0) {
            matchingRows.forEach(row2 => {
                result.push({ ...row1, ...row2 });
            });
        } else {
            // If there are no matching rows, just add the current row
            result.push(row1);
        }
    });

    return result;
  }