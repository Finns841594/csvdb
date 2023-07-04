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

export const generateUUID = (fileForUUID:string) => {
  const dataForUUID = [] as any[];
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

export const getCityNameFromTwoColumn = (rawDatafile:string, refCityName:string[], supplementCityList:string[], leftColumnName:string, rightColumnName:string) => {
  const result = [] as any[];
  fs.createReadStream(rawDatafile)
    .pipe(fastcsv.parse({ headers: true }))
    .on('data', (row) => {
      const cityFromRight = refCityName.filter(cityName => row[rightColumnName].match(cityName));
      const cityFromLeft = refCityName.filter(cityName => row[leftColumnName].match(cityName));
      const cityFromRight2 = supplementCityList.filter(cityName => row[rightColumnName].match(cityName));
      if (cityFromRight.length) {
        row['city_from_roomlist'] = cityFromRight[0];
        result.push(row);
      } else if (cityFromLeft.length) {
        row['city_from_roomlist'] = cityFromLeft[0];
        result.push(row);
      } else if (cityFromRight2.length) {
        row['city_from_roomlist'] = cityFromRight2[0];
        result.push(row);
      } else {
        result.push(row);
      }
    })
    .on('end', () => {
      fastcsv.write(result, { headers: true }).pipe(fs.createWriteStream(rawDatafile.replace('.csv', ' with cityname.csv')));
    })
}

export const getMinMaxNumberOfPeople = (rawDatafile:string) => {
  const result = [] as any[];
  fs.createReadStream(rawDatafile)
    .pipe(fastcsv.parse({ headers: true }))
    .on('data', (row) => {
      if (row['number_of_people_raw']) {
        const numberList = row['number_of_people_raw'].split(',').map(Number)
        if (numberList.length > 1) {
          row['number_of_people_min'] = Math.min(...numberList);
          row['number_of_people_max'] = Math.max(...numberList);
        } else {
          row['number_of_people_min'] = numberList[0];
          row['number_of_people_max'] = numberList[0];
        }
        result.push(row);
      } else {
        result.push(row);
      }
    })
    .on('end', () => {
      fastcsv.write(result, { headers: true }).pipe(fs.createWriteStream(rawDatafile.replace('.csv', ' with min-max number of people.csv')));
    })
}

export const getCityNamesFromOneColumn = (rawDatafileName:string) => {
  const listOfCityName = [] as string[];
  fs.createReadStream(rawDatafileName)
    .pipe(fastcsv.parse({ headers: true }))
    .on('data', (row) => {
      if (row['city'] && !listOfCityName.includes(row['city'])) {
        listOfCityName.push(row['city']);
      } 
    })
    .on('end', () => {
      fs.createWriteStream('listOfCityName.txt').write(listOfCityName.join('","'));
    })
}

// clean price with structure like this: "kr2500/day"
export const cleanPrice = (rawDatafile:string) => {
  const result = [] as any[];

  fs.createReadStream(rawDatafile)
    .pipe(fastcsv.parse({ headers: true }))
    .on('data', (row) => {
      if (row['price_raw']) {
        row['price_per_day'] = row['price_raw'].replace(/[^0-9]/g, '');
        result.push(row);
      } else {
        result.push(row);
      }
    })
    .on('end', () => {
      fastcsv.write(result, { headers: true }).pipe((fs.createWriteStream(rawDatafile.replace('.csv', ' with clean price.csv'))))
    });
}

// clean price with structure like this: "6190,00 kr"
export const cleanPrice2 = (rawDatafile:string) => {
  const result = [] as any[];

  fs.createReadStream(rawDatafile)
    .pipe(fastcsv.parse({ headers: true }))
    .on('data', (row) => {
      if (row['price_raw']) {
        const match = row['price_raw'].replace(/\s/g, '').split(',')[0];
        if (match) {
          row['price_per_day'] = parseInt(match)
        } 
        result.push(row);
      } else {
        result.push(row);
      }
    })
    .on('end', () => {
      fastcsv.write(result, { headers: true }).pipe((fs.createWriteStream(rawDatafile.replace('.csv', ' with clean price.csv'))))
    });
}

export const getHotelNameAndCityNameFromOneColumn = (rawDatafile:string) => {
  const result = [] as any[];

  fs.createReadStream(rawDatafile)
    .pipe(fastcsv.parse({ headers: true }))
    .on('data', (row) => {
      if (row['hotel_name_from_roomlist_raw']) {
        const parts = row['hotel_name_from_roomlist_raw'].split(/[/|]/)
        if (parts.length > 1) {
          row['hotel_name_from_roomlist'] = parts[0].trim();
          row['room_name'] = parts[1].trim();
        } else {
          row['hotel_name_from_roomlist'] = parts[0].trim();
        }
        result.push(row);
      } else {
        result.push(row);
      }
    })
    .on('end', () => {
      fastcsv.write(result, { headers: true }).pipe((fs.createWriteStream(rawDatafile.replace('.csv', ' with city name and hotel name.csv'))))
    });
}

export const roomFindPlaces = (roomsFileName:string, placeFileName:string) => {
  const result = [] as any[];
  const placeItems = [] as any[];
  const workingLog = [] as any[];

  fs.createReadStream(placeFileName)
    .pipe(fastcsv.parse({ headers: true }))
    .on('data', (place) => {
      const placeString = place['title'] + ', ' + place['address'];
      placeItems.push({UUID:place.UUID, placeString, place});
    })
    .on('end', () => {
      const compareResult = [] as any;
      fs.createReadStream(roomsFileName)
      .pipe(fastcsv.parse({ headers: true }))
      .on('data', (row) => {
        const roomString = row['hotel_name_from_roomlist'] + ', ' + row['address_from_roomlist'];
        placeItems.forEach(placeItem => {
          // comparison algorithem is to be modified !!!!!!
          const distance = natural.JaroWinklerDistance(roomString, placeItem.placeString, {ignoreCase: true});
          compareResult.push({UUID:placeItem.UUID, distance})
          workingLog.push({roomString, placeString: placeItem.placeString, distance})
        })
        // console.log('compareResult for ' + roomString, compareResult)
        const maxDistance = Math.max(...compareResult.map((item:any) => item.distance));
        console.log('maxDistance', maxDistance)
        const placeUUID = compareResult.filter((item:any) => item.distance === maxDistance)[0].UUID;
        row['placeUUID'] = placeUUID;
        row['distance'] = maxDistance;
        row['placeName'] = placeItems.filter(item => item.UUID === placeUUID)[0].place.title;
        result.push(row);
      })
      .on('end', () => {
        fastcsv.write(result, { headers: true }).pipe(fs.createWriteStream(roomsFileName.replace('.csv', ' with placeUUID.csv')))
        fastcsv.write(workingLog, { headers: true }).pipe(fs.createWriteStream(roomsFileName.replace('.csv', ' working log.csv')))
        console.log(`Done! Please check: ${roomsFileName.replace('.csv', ' with placeUUID.csv')}`)
      })
    })

}