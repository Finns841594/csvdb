# CSVDB
## A CSV Sanitiser

This project takes csv files of a specified name and "sanitises" them in line with certain criterea we had, allowing different sources of information to be aggregated in a way that could be used in a relational database or spreadsheet. 

The raw data is placed in a "processing_files" folder and based on the name of the input, a number of actions are taken to make such data more usable and create a common data object, regardless of the source of the input data and related fields.

## The Repository

Index.ts contains the required code for the layout of this system to work. Identifying which fields were to be sanitised in which way.

The functions themselves are stored within utilities.ts.

The Node.JS fs module is used to read the data stream and write the data files. The csv data is parsed by using the fast-csv library.

## Features

The following functionality is used:
- joinData and joinTwoTablesByKeyColumn - aggregates and merges the separate csv files into one file, once it has been sanitised and the data structure changed by the below functions.
- getCityNameFromTwoColumn and getCityNamesFromOneColumn - given the different data structures, this function looks at potential different sources of the city location information and compares them to a list of known cities for the data we have. A common field is then generated with the right data.
- getMinMaxNumberOfPeople - This compares data from different sources and in different data layouts, before providing a minimum and maximum size, or default values if they don't exist.
- cleanPrice - formats different pricing types to ensure the aggregate table has a common pricing structure.
- getHotelNameAndCityNameFromOneColumn - splits information from and address to extract place name and city.
- roomFindPlaces - compared extracted data to a list of known variables from another source, using Jaro Winkler Distance to allow for inexact matching. Due to the limited list of known variables entered, this function was not used in a final project.
- 

## The Team

This code was created as part of team consulting work. The project team was:
-[Feng Yang](https://github.com/Finns841594)
-[Chris O'Brien](https://github.com/chrisobrien88)
.[Stephen Moore](https://github.com/SMooreSwe)

## License

MIT


  
