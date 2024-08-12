/**
 * amCharts 4 locale
 *
 * Locale: az_AZ
 * Language: Azerbaijani (Azerbaijan)
 *
 * Follow instructions in [on this page](https://www.amcharts.com/docs/v4/tutorials/creating-translations/) to make corrections or add new translations.
 */
export default {
  // Number formatting options
  _decimalSeparator: ".",
  _thousandSeparator: ",",

  // Suffixes for numbers
  _big_number_suffix_3: "k",
  _big_number_suffix_6: "M",
  _big_number_suffix_9: "G",
  _big_number_suffix_12: "T",
  _big_number_suffix_15: "P",
  _big_number_suffix_18: "E",
  _big_number_suffix_21: "Z",
  _big_number_suffix_24: "Y",

  _small_number_suffix_3: "m",
  _small_number_suffix_6: "μ",
  _small_number_suffix_9: "n",
  _small_number_suffix_12: "p",
  _small_number_suffix_15: "f",
  _small_number_suffix_18: "a",
  _small_number_suffix_21: "z",
  _small_number_suffix_24: "y",

  _byte_suffix_B: "B",
  _byte_suffix_KB: "KB",
  _byte_suffix_MB: "MB",
  _byte_suffix_GB: "GB",
  _byte_suffix_TB: "TB",
  _byte_suffix_PB: "PB",

  // Default date formats for various periods
  _date: "yyyy-MM-dd",
  _date_millisecond: "mm:ss SSS",
  _date_second: "HH:mm:ss",
  _date_minute: "HH:mm",
  _date_hour: "HH:mm",
  _date_day: "MMM dd",
  _date_week: "ww",
  _date_month: "MMM",
  _date_year: "yyyy",

  // Default duration formats for various base units
  _duration_millisecond: "SSS",
  _duration_millisecond_second: "ss.SSS",
  _duration_millisecond_minute: "mm:ss SSS",
  _duration_millisecond_hour: "hh:mm:ss SSS",
  _duration_millisecond_day: "d'd' mm:ss SSS",
  _duration_millisecond_week: "d'd' mm:ss SSS",
  _duration_millisecond_month: "M'm' dd'd' mm:ss SSS",
  _duration_millisecond_year: "y'y' MM'm' dd'd' mm:ss SSS",

  _duration_second: "ss",
  _duration_second_minute: "mm:ss",
  _duration_second_hour: "hh:mm:ss",
  _duration_second_day: "d'd' hh:mm:ss",
  _duration_second_week: "d'd' hh:mm:ss",
  _duration_second_month: "M'm' dd'd' hh:mm:ss",
  _duration_second_year: "y'y' MM'm' dd'd' hh:mm:ss",

  _duration_minute: "mm",
  _duration_minute_hour: "hh:mm",
  _duration_minute_day: "d'd' hh:mm",
  _duration_minute_week: "d'd' hh:mm",
  _duration_minute_month: "M'm' dd'd' hh:mm",
  _duration_minute_year: "y'y' MM'm' dd'd' hh:mm",

  _duration_hour: "hh'h'",
  _duration_hour_day: "d'd' hh'h'",
  _duration_hour_week: "d'd' hh'h'",
  _duration_hour_month: "M'm' dd'd' hh'h'",
  _duration_hour_year: "y'y' MM'm' dd'd' hh'h'",

  _duration_day: "d'd'",
  _duration_day_week: "d'd'",
  _duration_day_month: "M'm' dd'd'",
  _duration_day_year: "y'y' MM'm' dd'd'",

  _duration_week: "w'w'",
  _duration_week_month: "w'w'",
  _duration_week_year: "w'w'",

  _duration_month: "M'm'",
  _duration_month_year: "y'y' MM'm'",

  _duration_year: "y'y'",

  // Era translations
  _era_ad: "AD",
  _era_bc: "BC",

  // Day part, used in 12-hour formats, e.g. 5 P.M.
  A: "",
  P: "",
  AM: "",
  PM: "",
  "A.M.": "",
  "P.M.": "",

  // Date-related
  January: "Yanvar",
  February: "Fevral",
  March: "Mart",
  April: "Aprel",
  May: "May",
  June: "İyun",
  July: "İyul",
  August: "Avqust",
  September: "Sentyabr",
  October: "Oktyabr",
  November: "Noyabr",
  December: "Dekabr",
  Jan: "Yav",
  Feb: "Fev",
  Mar: "Mar",
  Apr: "Apr",
  "May(short)": "May",
  Jun: "İyn",
  Jul: "İyl",
  Aug: "Avq",
  Sep: "Sen",
  Oct: "Okt",
  Nov: "Noy",
  Dec: "Dek",

  // Weekdays.
  Sunday: "Bazar",
  Monday: "Bazar ertəsi",
  Tuesday: "Çərşənbə axşamı",
  Wednesday: "Çərşənbə",
  Thursday: "Cümə axşamı",
  Friday: "Cümə",
  Saturday: "Şənbə",
  Sun: "B.",
  Mon: "B.e.",
  Tue: "Ç.a.",
  Wed: "Ç.",
  Thu: "C.a.",
  Fri: "C.",
  Sat: "Ş.",

  // Date ordinal function.
  _dateOrd: function (day: number): string {
    return " ";
  },

  // Various chart controls.
  "Zoom Out": "Uzaqlaşdırın",

  // Timeline buttons
  Play: "Oynat",
  Stop: "Dayandır",

  Legend: "Legend",
  "Click, tap or press ENTER to toggle":
    "Keçmək üçün basın, vurun və ya ENTER düyməsini basın",
  Loading: "Yüklənir",
  Home: "Ev",
  Chart: "",
  "Serial chart": "Serial qrafik",
  "X/Y chart": "X/Y qrafiki",
  "Pie chart": "Dairəvi diaqram",
  "Gauge chart": "Ölçmə qrafiki",
  "Radar chart": "Radar qrafiki",
  "Sankey diagram": "Sankey diaqramı",
  "Flow diagram": "Akış diaqramı",
  "Chord diagram": "Akkord diaqramı",
  "TreeMap chart": "TreeMap qrafiki",
  "Force directed tree": "Gücə yönəldilmiş ağac qrafiki",
  "Sliced chart": "Dilimlənmiş qrafik",

  // Series types
  Series: "Serial",
  "Candlestick Series": "Şam Seriyası",
  "OHLC Series": "OHLC Seriyası",
  "Column Series": "Sütun Seriyası",
  "Line Series": "Xətt seriyası",
  "Pie Slice Series": "Dairəvi Dilim Seriyası",
  "Funnel Series": "Huni seriyası",
  "Pyramid Series": "Piramida Seriyası",
  "X/Y Series": "X/Y Seriyası",

  // Map-related
  Map: "",
  "Press ENTER to zoom in": "Böyütmək üçün ENTER düyməsini basın",
  "Press ENTER to zoom out": "Kiçikləşdirmək üçün ENTER düyməsini basın",
  "Use arrow keys to zoom in and out":
    "Böyütmək və kiçiltmək üçün ox düymələrindən istifadə edin",
  "Use plus and minus keys on your keyboard to zoom in and out":
    "Böyütmək və kiçiltmək üçün klaviaturanızda artı və eksi düymələrindən istifadə edin",

  // Export-related
  Export: "İxrac edin",
  Image: "Şəkil",
  Data: "Məlumat",
  Print: "Çap et",
  "Press ENTER or use arrow keys to navigate":
    "Naviqasiya etmək üçün ENTER düyməsini basın və ya ox düymələrindən istifadə edin",
  "Click, tap or press ENTER to open":
    "Açmaq üçün basın, vurun və ya ENTER düyməsini basın",
  "Click, tap or press ENTER to print.":
    "Çap etmək üçün basın, vurun və ya ENTER düyməsini basın.",
  "Click, tap or press ENTER to export as %1.":
    "%1 olaraq ixrac etmək üçün basın, vurun və ya ENTER düyməsini basın.",
  'To save the image, right-click this link and choose "Save picture as..."':
    'Şəkli saxlamaq üçün bu linkə sağ vurun və "Şəkli başqa cür saxla ..." seçin.',
  'To save the image, right-click thumbnail on the left and choose "Save picture as..."':
    'Şəkli saxlamaq üçün soldakı kiçik şəklə sağ vurun və "Şəkli başqa şəkildə saxla ..." seçin.',
  "(Press ESC to close this message)":
    "(Bu mesajı bağlamaq üçün ESC düyməsini basın)",
  "Image Export Complete": "Şəkil İxracatı Tamamlandı",
  "Export operation took longer than expected. Something might have gone wrong.":
    "İxrac əməliyyatı gözlənildiyindən daha uzun çəkdi. Bir şey səhv ola bilər.",
  "Saved from": "Buradan yadda saxlandı",
  PNG: "",
  JPG: "",
  GIF: "",
  SVG: "",
  PDF: "",
  JSON: "",
  CSV: "",
  XLSX: "",

  // Scrollbar-related
  "Use TAB to select grip buttons or left and right arrows to change selection":
    "Tutuş düymələrini seçmək üçün TAB -dan istifadə edin və ya seçimi dəyişdirmək üçün sol və sağ oxlardan istifadə edin",
  "Use left and right arrows to move selection":
    "Seçimi hərəkət etdirmək üçün sol və sağ oxlardan istifadə edin",
  "Use left and right arrows to move left selection":
    "Sol seçimi daşımaq üçün sol və sağ oxlardan istifadə edin",
  "Use left and right arrows to move right selection":
    "Sağ seçimi seçmək üçün sol və sağ oxlardan istifadə edin",
  "Use TAB select grip buttons or up and down arrows to change selection":
    "Seçimi dəyişdirmək üçün TAB seçin tutma düymələrindən və ya yuxarı və aşağı oxlardan istifadə edin",
  "Use up and down arrows to move selection":
    "Seçimi daşımaq üçün yuxarı və aşağı oxlardan istifadə edin",
  "Use up and down arrows to move lower selection":
    "Daha aşağı seçimi seçmək üçün yuxarı və aşağı oxlardan istifadə edin",
  "Use up and down arrows to move upper selection":
    "Yuxarı seçimi hərəkət etmək üçün yuxarı və aşağı oxlardan istifadə edin",
  "From %1 to %2": "%1 -dən %2 -ə qədər",
  "From %1": "%1 -dən",
  "To %1": "%1 -ə",

  // Data loader-related.
  "No parser available for file: %1": "Fayl üçün analizator yoxdur: %1",
  "Error parsing file: %1": "Faylın təhlili zamanı xəta: %1",
  "Unable to load file: %1": "Fayl yüklənə bilmir: %1",
  "Invalid date": "Yanlış tarix",

  // Common actions
  Close: "Bağla",
  Minimize: "Minimize edin",
};
