import * as fs from 'fs';
import * as fastcsv from 'fast-csv';
import * as natural from 'natural';
import { v4 as uuidv4 } from 'uuid';
import { cleanPrice, cleanPrice2, generateUUID, getCityNameFromTwoColumn, getCityNamesFromOneColumn, getHotelNameAndCityNameFromOneColumn, getMinMaxNumberOfPeople, roomFindPlaces } from './utilities';
import { cityList, supplementCityList } from './cityList';

let data1: any[] = [];
let data2: any[] = [];
let dataForUUID: any[] = [];

const keyColumn = 'Origin URL';
const file1 = 'processing_files/Room Details List-Grid view.csv'
const file2 = 'processing_files/Captured Texts-Grid view.csv'
const fileForUUID = 'processing_files/AllPlaces Sweden.csv'
const outputFileName = 'processing_files/output.csv'
const rawDatafile1 = 'processing_files/AllRooms - meetingsbooker raw.csv'
const rawDatafile2 = 'processing_files/AllRooms - timetomeet raw.csv'
const rawDatafile3 = 'processing_files/AllRooms - venuu raw.csv'

const allrooms = 'processing_files/AllRooms - venuu.csv'
const allplaces = 'processing_files/AllPlaces Sweden with uuid.csv'

const locationsToBeAdded = 'processing_files/locations list.csv' 

// getCityNamesFromOneColumn('dataset_crawler-google-places_2023-06-21_14-04-26-348-sweden.csv')

// getCityNameFromTwoColumn(rawDatafile1, cityList, supplementCityList, 'hotel_name_from_roomlist', 'city_name_raw')
// getMinMaxNumberOfPeople(rawDatafile1)
// cleanPrice(rawDatafile1)

// cleanPrice2(rawDatafile2)
// getCityNameFromTwoColumn(rawDatafile2, cityList, 'hotel_name_from_roomlist', 'address_from_roomlist')

// cleanPrice2(rawDatafile3)
// getHotelNameAndCityNameFromOneColumn(rawDatafile3)

// generateUUID(fileForUUID)

// roomFindPlaces(allrooms, allplaces)

// const result = natural.JaroWinklerDistance('Radisson Hotel, Stockholm', 'Radisson Hotl', { ignoreCase: true })
// console.log(result)