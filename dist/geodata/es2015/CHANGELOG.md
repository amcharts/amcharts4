# amCharts 4 Geo Data Changelog

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [UNRELEASED] - ????-??-??

### Added
- New maps: Mauritius.

### Changed
- Renamed "Turkey" to "Türkiye" in all maps.
- Saint Kitts and Nevis is now specified as belonging North America in `countries2` data file.


## [4.1.23] - 2022-03-31

### Added
- New map: `regions/world/africaMorocco*` (Moroccan version of the map of Africa).
- New map: `latvia2021*` (updated in 2021 region map for Latvia).
- New map: Taiwan.
- New map: `spainProvinces2*` (same as `spainProvinces*` except with overseas territories moved close to mainland).
- New map: `franceDepartments2*` (mainland + overseas departments).

### Fixed
- Fixed area IDs in map of Slovenia.
- Fixed JSON syntax error in `ugandaLow.json`.
- Added some missing maps to `countries` and `countries2` data files.
- Fixed some name typos in the map of Hungary.
- Fixed names in the map of Chad.
- Fixed Morelos (Mexico) county map.


## [4.1.22] - 2021-09-24

### Changed
- Updated province IDs to recent changes in ISO in a map of South Africa.

### Fixed
- Fixed Svalbard map.
- Fixed Nigeria map.
- Fixed US Congressional maps: Alabama, Florida, Maine, Maryland, Massachusetts, New Jersey, Michigan, Rhode Island, Virginia, Washington.


## [4.1.21] - 2021-06-23

### Added
- New Maps: Lesotho, Liberia, Regions of Uganda, French Polynesia, Province map of Ireland, World outline (whole world as a single polygon).

### Fixed
- Fixed ID and naming issues in the maps of Uganda.


## [4.1.20] - 2021-04-19

### Added
- New maps: Côte d'Ivoire (Ivory Coast), Uganda, Province map of Italy.

### Fixed
- Fixed polygon IDs for the Congressional district Map of Minnesota.
- Some countries were missing in data files.
- Fixed map of Faroe Islands.
- Fixed map of Svalbard.


## [4.1.19] - 2020-11-11

### Added
- New country map: Afghanistan.
- New regional map: Map of Asia (India version). `region/world/asiaIndia*`.


## [4.1.18] - 2020-10-29

### Added
- New country map: Jordan.

### Changed
- Geodata script evrsion does not include `.map` files anymore.

### Fixed
- Fixed faulty maps: Curaçao.
- Fixed IDs for Jiangxi and Jiangsu provinces in maps of China.


## [4.1.17] - 2020-08-04

### Added
- New maps: Timor-Leste, Trinidad and Tobago, Falkland Islands, Guam, Northern Mariana, Montserrat, Grenada, Martinique, Saint Barthélemy, U.S. Virgin Islands, British Virgin Islands, Guadeloupe, Turks and Caicos Islands, Haiti.

### Fixed
- Fixed some name typos in Malaysian maps.
- Fixed IDs and some names in maps of Russia: ID for Tatarstan; ID and name for Altay (Republic); added "Kray" to Altay Kray to distinguish from the name-sake republic.
- Fixed Polish translation for Myanmar (`lang/PL`).
- Fixed Chile map: Ñuble region was missing.


## [4.1.16] - 2020-07-03

### Added
- New maps: Iraq.
- New India map: `india2020*` which reflects unified territories Dadra, Nagar, Haveli, Daman, and Diu. Please note that there's no official ISO classification for the newly created territory, so we're using "IN-DNDD" for now.

### Fixed
- Ohio congressional district map was missing.
- Fixed spelling of Kyiv (city and district) in Ukrainian maps.
- Fixed spelling of Eswatini across all maps.


## [4.1.15] - 2020-05-08

### Added
- New map `norway2020*` to reflect updated sub-division for Norway. The old version (`norway*`) is still there for backwards compatibility.
- New maps: Montenegro, Iran, South Sundan (two versions: official and unofficial from 2015).

### Fixed
- Fixed minor issues in Virginia County map.
- Fixed ID for Cotabato in map of Phillipines.


## [4.1.14] - 2020-03-27

### Changed
- Potentially breaking change! Some maps had their area name property mistakenly set in uppercase. Some 80 map files affected. If you are currently using "NAME" data field, or `{NAME}` placeholder, make sure you change those to lowercase (`"name"` or `{name}`).


## [4.1.13] - 2020-03-26

### Added
- New UK map: `ukCountries*` (consists of England, Scotland, Wales, North Ireland, with Ireland for shape consistency).
- New timezone-related maps: `worldTimeZones*` (polygons for each time zone used in the world) and `worldTimeZoneAreas*` (land mass areas that use particular time zone).
- New maps: British Indian Ocean Territory, Cayman Islands, Cocos (Keeling) Islands, Comoros.

### Fixed
- Typo in map file of Turkmenistan, as well as uppercase "NAME" property, changed to lowercase "name".
- Some name typos fixed in US County maps.


## [4.1.12] - 2020-02-17

### Added
- New maps: Bahamas, Eritrea, Ethiopia, Gambia, Ghana, Guinea Bissau, Guyana, Kuwait, Laos, Libya, Luxembourg, Madagascar (province and region), Mozambique, Myanmar, Niger, North Macedonia, Rwanda, Sierra Leone, Suriname, Togo, Turkmenistan.


## [4.1.11] - 2020-01-30

### Added
- New maps: Cuba, Jamaica, Uruguay.
- Mexico county files added (`region/mexico`). Use like with prefix `am4geodata_region_mexico_*`.


## [4.1.10] - 2020-01-14

### Added
- New map `worldRussia*` added.
- New map `worldMorocco*` added.

### Fixed
- Fixed spelling of Uzbekistan in supplementary data files.


## [4.1.9] - 2019-11-19

### Changed
- `country.json` file was moved to `/data/` subfolder.

### Added
- New maps: Malawi, Mauritania.
- New map `india2019` added to reflect India's latest regional re-organization.
- New map `worldChina*` added.
- A set of Canada county maps in `region/canada`.
- New data JSON files added `data/countries2.js` and `json/data/countries2.json` that contain a lot of information about each country, including which maps correspond country code and related continent.
- Supplemental country data files are now in `data` folder and are available in two flavors: as a JS module (creating global variable e.g. `am4geodata_data_countries`) and as pure JSON.


## [4.1.8] - 2019-10-23

### Added
- New maps: Guatemala, Lebanon, Paraguay.
- U.S. Congressional Districts maps. Look in `region/usa/congressional`. Use like with prefix `am4geodata_region_usa_congressional_*`. [Usage instructions](https://www.amcharts.com/docs/v4/tutorials/using-us-congressional-districts-maps/).
- New world map: `worldGreatLakes*`. It's a version of a World Map with the Great Lakes cut out, to make them consistent with US/Canada regional maps.
- Translation files to country names in various languages added to `lang` directory. [Usage instructions](https://www.amcharts.com/docs/v4/tutorials/using-map-country-name-translations/).

### Fixed
- Fixed duplicate ids in `russiaCrimea*` maps.
- Updated map of The Netherlans to not include river cutouts.

## [4.1.7] - 2019-07-31

### Added
- New maps: Gabon, Kenya.

### Fixed
- Fixed map: `ukCounties` map has Scotland wrong.
- Fixed map: `venezuela` map had a typo in name of "Carabobo".
- Fixed map: `worldRegions*` map had a wrong id for "Africa".
- Typo in `uzbekistan` map file names fixed.

## [4.1.6] - 2019-06-10

### Fixed
- Fixed map: Azerbaijan (incorrect ISO code for a single area).
- Fixed map: Channel Islands (empty area on low-res map).
- Fixed map: Guinea (broken coding of area names).
- Fixed map: Seychelles ("SC-00" had an empty type).

## [4.1.5] - 2019-05-10

### Added
- New maps: Benin, Equatorial Guinea.
- New file `countries.json` which maps country ISO2 code to available geodata files/names.

### Fixed
- Fixed maps: Ireland, Philippines, Zambia.

## [4.1.4] - 2019-03-12

### Added
- New maps: Anguilla, Antigua Barbuda, Aruba, Barbados, Bonaire, Sint Eustatius and Saba, Curaçao.

### Fixed
- Fixed map of Malaysia.

## [4.1.3] - 2019-02-26

### Added
- Additional county maps for Alaska and Hawaii in Albers projection, for drill-down scenarios involving usaAlbers map.
- New map: American Samoa.

## [4.1.2] - 2019-02-17

### Added
- New map: Indonesia.

### Changed
- Renamed "Macedonia (FYROM)" to "North Macedonia" in all World/European maps.

## [4.1.1] - 2019-01-31

### Changed
- Renamed "Macedonia" to "Macedonia (FYROM)" on all World/European maps.

## [4.1.0] - 2019-01-30

### Changed
- Standalone scripts were recompiled to use unique Webpack scope, to avoid conflicts with other Webpack packages. To avoid breakage, make sure you update to 4.1 version of main amCharts 4 package as well.

## [4.0.30] - 2019-01-28

### Added
- New maps: Bosnia Herzegovina (two versions), Cyprus (two versions), Dominica, Kosovo, Philippines, Serbia (two versions), Tunisia, Turkey, United Arab Emyrates, Ukraine, Uzbekistan, Vatikan City, Venezuela, Vietnam, Yemen, Zambia, Zimbabwe.

### Fixed
- Fixed spelling of "Warmińsko-Mazurskie" region in maps of Poland.

## [4.0.29] - 2019-01-22

### Fixed
- Maintenance release.

## [4.0.28] - 2019-01-22

### Added
- Added new highest detail level of most world/region maps "ultra", e.g. `worldUltra`. The level of detail is the same as individual country maps, so they are suitable for combining.
- New maps: Saudi Arabia, Senegal, Seychelles, Singapore, Slovakia, Slovenia, Solomon Islands, Somalia, South Africa, Sri Lanka, Saint Helena, Saint Kitts and Nevis, Saint Lucia, Saint Vincent, Sudan, Svalbard, Sweden, Switzerland, Syria, Tajikistan, Tanzania, Thailand.

## [4.0.27] - 2019-01-08

### Added
- New maps: USA Terroritories (2 versions).

### Changed
- Renamed Czech Republic to Czechia in all maps.
- Czech maps are now available with two names: Czechia and czechRepublic.

## [4.0.26] - 2018-12-28

### Added
- New maps: Pakistan, Peru, Qatar, Romania, Saint Pierre and Miquelon, Samoa, San Marino, São Tomé and Príncipe.

### Fixed
- Fixed maps with missing areas: Norway, Europe, Asia.

## [4.0.25] - 2018-12-26

### Added
- New maps: New Zealand, Nicaragua, Nigeria, North Korea, Norway, Maldives, Oman.

## [4.0.24] - 2018-12-20

### Added
- New maps: Nepal, The Netherlands.

### Fixed
- Fixed an ID of an area in map of Greenland.

## [4.0.23] - 2018-12-19

### Fixed
- Fixed shape of Antarctica in continentsLow/High maps.

## [4.0.22] - 2018-12-17

### Added
- New country maps: Mali, Malta, Moldova, Mongolia, Namibia, Poland.
- New world regions maps (look in `region/world`): Africa, Asia, Caribbean, Central America, Europe, Latin America, Middle East, North America, Oceania, South America, World Regions.
- Two new continents map versions: all of Russia in Asia, all of russia in Europe.

### Fixed
- Fixed all world maps that were lacking Tuvalu.
- Fixed duplicate ids in maps of Argentina.

## [4.0.21] - 2018-12-02

### Added
- New maps: Colombia (municipalities), Kazakhstan, Kyrgyzstan, Latvia, Liechtenstein, Lithuania, Malaysia, Morocco, Portugal (including map for regions), Puerto Rico, Panama.

### Fixed
- Some coastal tweaks in `world*` maps.

## [4.0.20] - 2018-11-18

### Fixed
- Fixed typo in Canadian map file name.

## [4.0.19] - 2018-11-14

### Fixed
- Fixed map of United Kingdom.

## [4.0.18] - 2018-11-11

### Fixed
- Fixed map of Austria.

## [4.0.17] - 2018-11-11

### Fixed
- Refined areas of the world maps.

## [4.0.16] - 2018-11-07

### Fixed
- Updated some area names in Dominican Republic municipal maps.

## [4.0.15] - 2018-10-30

### Fixed
- South Korean maps had some areas missing.

## [4.0.14] - 2018-10-29

### Changed
- IMPORTANT! The area IDids have been changed in U.S. County maps (`geodata/regions/usa`) to support latest 5-digit FIPS standard (XXYYY where XX is number code of the state and YYY is code for the county).

## [4.0.13] - 2018-10-01

### Fixed
- Fixed map of Azerbaijan.

## [4.0.12] - 2018-09-28

### Added
- U.S. county maps added to sub-folder `/region/usa/`. In JavaScript these maps are available in global variable `am4geodata_region_usa_*`, e.g. `am4geodata_region_usa_akLow` for a file `geodata/region/usa/akLow.js`.

### Fixed
- Added "name" attributes to polygons in `continents*` maps.

## [4.0.11] - 2018-09-18

### Added
- New maps: Ecuador, Egypt, El Salvador, Estonia, Eswatini (Swaziland), Faroe Islands, Fiji (East and West), Finland, French Guiana, Georgia (2 versions), Greece, Greenland, Guinea, Honduras, Hong Kong, Hungary, Iceland, Ireland, Italy.

### Removed
- `usa2*` maps that were invalid. Use `usaAlbers*` instead.

## [4.0.10] - 2018-09-01

### Added
- New maps: Bermuda, Israel (two versions: w/ Palestine subdivisions and Palestine as a single unit), Palestine, Cambodia, Cameroon, Cape Verdi, Central African Republic, Chad, Channel Islands, Chile, Colombia, Congo, Congo (Democratic Republic), Costa Rica, Croatia, Czech Republic, Denmark, Djibouti, Dominican Republic, Dominican Republic (Municipalities).

## [4.0.9] - 2018-08-13

### Added
- New maps: Bahrain, Bangladesh, Belarus, Belgium, Belize, Bhutan, Bolivia, Botswana, Brunei Darussalam, Bulgaria, Burkina Faso, Burundi.

### Fixed
- Fixed wrong id for Agdas district on map of Azerbaijan.

## [4.0.8] - 2018-08-08

### Added
- New maps: Albania, Algeria, Andorra, Angola, Argentina, Armenia, Austria, Azerbaijan.

### Fixed
- Antarctica was mishaped in worldLow.

## [4.0.7] - 2018-07-29

### Added
- New maps: World map (India version), United Nations World Regions map, United Kindom, United Kindom Counties, India.

### Changed
- Increased detail of World map (high-detail version)

## [4.0.6] - 2018-07-26

### Added
- New maps: Russia, Russia w/ Crimea, Spain, Spain w/ Provinces

## [4.0.5] - 2018-07-25

### Added
- New maps: Australia, Brazil, Canada, China, Japan, France Departments, Germany, Mexico, South Korea.

## [4.0.4] - 2018-07-19

### Fixed
- USA map was broken

### Added
- New maps: France, USA (Albers projection)

## [4.0.3] - 2018-05-10

### Added
- Added this `CHANGELOG.md`.