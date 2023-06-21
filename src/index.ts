import * as fs from 'fs';
import * as fastcsv from 'fast-csv';
import * as natural from 'natural';
import { v4 as uuidv4 } from 'uuid';

let data1: any[] = [];
let data2: any[] = [];
let dataForUUID: any[] = [];

const keyColumn = 'Origin URL';
const file1 = 'Room Details List-Grid view.csv'
const file2 = 'Captured Texts-Grid view.csv'
const fileForUUID = 'Captured Texts-Grid view.csv'
const outputFileName = 'output.csv'



