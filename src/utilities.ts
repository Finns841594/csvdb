import * as fs from 'fs';
import * as fastcsv from 'fast-csv';
import * as natural from 'natural';
import { v4 as uuidv4 } from 'uuid';

export const joinData = (data1: any[], data2: any[], keyColumn: string) => {
  let result: any[] = [];

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

export const generateReport = (data1: any[], data2: any[], file1:any, file2:any, keyColumn: string, joinedData: any[]): string => {
  const result = 
  `
  ------------------------------------- 
  Total number of rows in ${file1}: ${data1.length} 
  Total number of rows in ${file2}: ${data2.length} 
  Joined by key column: ${keyColumn} 
  Total number of rows in joined data: ${joinedData.length} 
  ------------------------------------- 
  Total number of headers in ${file1}: ${Object.keys(data1[0]).length} 
  Total number of headers in ${file2}: ${Object.keys(data2[0]).length} 
  Total number of headers in joined data: ${Object.keys(joinedData[0]).length} 
  ------------------------------------- 
  Headers that not in ${file1}: \n    ${Object.keys(joinedData[0]).filter((header) => !Object.keys(data1[0]).includes(header)).map(item => item + `\n`).join('    ')}
  ------------------------------------- \n`;

  return result
}

export const joinTwoTablesByKeyColumn = (data1:any[], data2:any[], file1:any, file2:any, keyColumn:string, outputFileName:string) => {
  // data1 should be the larger dataset
  fs.createReadStream(file1)
    .pipe(fastcsv.parse({ headers: true }))
    .on('data', (row) => {
      data1.push(row);
    })
    .on('end', () => {
      // Parsing second CSV file after the first has completed
      // console.log('data1 length', data1.length, '\n ⭐️⭐️⭐️ data1 headers', '\n' , Object.keys(data1[0]), );
      fs.createReadStream(file2)
          .pipe(fastcsv.parse({ headers: true }))
          .on('data', (row) => {
              data2.push(row);
          })
          .on('end', () => {
            // console.log('data2️⃣ length', data2.length, '\n ⭐️⭐️⭐️ data2️⃣ headers', '\n' , Object.keys(data2[0]), );
            // Join the data based on the key column
            let joinedData = joinData(data1, data2, keyColumn);
            console.log(generateReport(data1, data2, file1, file2, keyColumn, joinedData));
            // Write the results to a new CSV file
            fastcsv.write(joinedData, { headers: true }).pipe(fs.createWriteStream(outputFileName));
          });
  });
}


// let str1 = "Radisson Hotel, Stockholm";
// let str2 = "";

// console.log(natural.JaroWinklerDistance(str1, str2, {ignoreCase: true}));

export const generateUUID = (fileForUUID:string, dataForUUID:any[]) => {
  fs.createReadStream(fileForUUID)
    .pipe(fastcsv.parse({ headers: true }))
    .on('data', (row) => {
      const uuid = uuidv4();
      row['UUID'] = uuid;
      dataForUUID.push(row);
    })
    .on('end', () => {
      fastcsv.write(dataForUUID, { headers: true }).pipe(fs.createWriteStream(fileForUUID.replace('.csv', ' with uuid.csv')));
    })
}

export const getCityNameFromTwoColumn = (rawDatafile:any, refCityName:string[]) => {
  const result = [];
  fs.createReadStream(rawDatafile)
    .pipe(fastcsv.parse({ headers: true }))
    .on('data', (row) => {
      if (refCityName.includes(row['city_name_raw'])) {
        row['city_from_roomlist'] = row['city_name_raw'];
        result.push(row['City Name']);
      }
    })
}