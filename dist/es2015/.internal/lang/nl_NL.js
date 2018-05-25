/**
 * Translation file
 * Locale: en (default international English)
 *
 * Use this file as a template to create translations. Leave the key part in
 * English intact. Fill the value with a translation.
 *
 * Empty string means no translation, so default "Internationtional English"
 * will beused.
 *
 * IMPORTANT:
 * When translating make good effort to keep the translation length
 * at least the same chartcount as the English, especially for short prompts.
 *
 * Having significantly longer prompts may distort the actual charts.
 *
 * NOTE:
 * Some prompts - like months or weekdays - come in two versions: full and
 * shortened.
 *
 * If there's no official shortened version of these in your language, and it
 * would not be possible to invent such short versions that don't seem weird
 * to native speakers of that language, fill those with the same as full
 * version.
 *
 * PLACEHODERS:
 * Some prompts have placeholders like "%1". Those will be replaced by actual
 * values during translation and should be retained in the translated prompts.
 *
 * Placeholder positions may be changed to better suit structure of the
 * sentence.
 *
 * For example "From %1 to %2", when actually used will replace "%1" with an
 * actual value representing range start, and "%2" will be replaced by end
 * value.
 *
 * E.g. in a Scrollbar for Value axis "From %1 to %2" will become
 * "From 100 to 200". You may translate "From" and "to", as well as re-arrange
 * the order of the prompt itself, but make sure the "%1" and "%2" remain, in
 * places where they will make sense.
 *
 * Save the file as language_LOCALE, i.e. en_GB, fr_FR, etc.
 *
 * @type {ILocale}
 */
export default {
    // Number formatting options.
    //
    // Please check with the local standards which separator is accepted to be
    // used for separating decimals, and which for thousands.
    "_decimalSeparator": ",",
    "_thousandSeparator": ".",
    // Default date formats for various periods.
    //
    // This should reflect official or de facto formatting universally accepted
    // in the country translation is being made for
    // Available format codes here:
    // https://www.amcharts.com/docs/v4/concepts/formatters/formatting-date-time/#Format_codes
    //
    // This will be used when formatting date/time for particular granularity,
    // e.g. "_date_hour" will be shown whenever we need to show time as hours.
    "_date_millisecond": "mm:ss SSS",
    "_date_second": "HH:mm:ss",
    "_date_minute": "HH:mm",
    "_date_hour": "HH:mm",
    "_date_day": "d MMM",
    "_date_week": "ww",
    "_date_month": "MMM",
    "_date_year": "yyyy",
    // Default duration formats for various base units.
    //
    // This will be used by DurationFormatter to format numeric values into
    // duration.
    //
    // Available codes here:
    // https://www.amcharts.com/docs/v4/concepts/formatters/formatting-duration/#Available_Codes
    "_duration_millisecond": "SSS",
    "_duration_second": "ss",
    "_duration_minute": "mm",
    "_duration_hour": "hh",
    "_duration_day": "dd",
    "_duration_week": "ww",
    "_duration_month": "MM",
    "_duration_year": "yyyy",
    // Era translations
    "_era_ad": "AD",
    "_era_bc": "v.C.",
    // Day part, used in 12-hour formats, e.g. 5 P.M.
    // Please note that these come in 3 variants:
    // * one letter (e.g. "A")
    // * two letters (e.g. "AM")
    // * two letters with dots (e.g. "A.M.")
    //
    // All three need to to be translated even if they are all the same. Some
    // users might use one, some the other.
    "A": "A",
    "P": "P",
    "AM": "AM",
    "PM": "PM",
    "A.M.": "a.m.",
    "P.M.": "p.m.",
    // Date-related stuff.
    //
    // When translating months, if there's a difference, use the form which is
    // best for a full date, e.g. as you would use it in "2018 January 1".
    //
    // Note that May is listed twice. This is because in English May is the same
    // in both long and short forms, while in other languages it may not be the
    // case. Translate "May" to full word, while "May(short)" to shortened
    // version.
    "January": "januari",
    "February": "februari",
    "March": "maart",
    "April": "april",
    "May": "mei",
    "June": "juni",
    "July": "juli",
    "August": "augustus",
    "September": "september",
    "October": "oktober",
    "November": "november",
    "December": "december",
    "Jan": "Jan",
    "Feb": "Feb",
    "Mar": "Mrt",
    "Apr": "Apr",
    "May(short)": "Mei",
    "Jun": "Jun",
    "Jul": "Jul",
    "Aug": "Aug",
    "Sep": "Sep",
    "Oct": "Okt",
    "Nov": "Nov",
    "Dec": "Dec",
    // Weekdays.
    "Sunday": "zondag",
    "Monday": "maandag",
    "Tuesday": "dinsdag",
    "Wednesday": "woensdag",
    "Thursday": "donderdag",
    "Friday": "vrijdag",
    "Saturday": "zaterdag",
    "Sun": "Zo",
    "Mon": "Ma",
    "Tue": "Di",
    "Wed": "Wo",
    "Thu": "Do",
    "Fri": "Vr",
    "Sat": "Za",
    // Date ordinal function.
    //
    // This is used when adding number ordinal when formatting days in dates.
    //
    // E.g. "January 1st", "February 2nd".
    //
    // The function accepts day number, and returns a string to be added to the
    // day, like in default English translation, if we pass in 2, we will receive
    // "nd" back.
    "_dateOrd": function (day) {
        var res = "de";
        if (day == 1 || day == 8 || day > 19) {
            res = "ste";
        }
        return res;
    },
    // Various chart controls.
    // Shown as a tooltip on zoom out button.
    "Zoom Out": "Uitzoomen",
    // Timeline buttons
    "Play": "Afspelen",
    "Stop": "Stoppen",
    // Chart's Legend screen reader title.
    "Legend": "Legenda",
    // Legend's item screen reader indicator.
    "Click, tap or press ENTER to toggle": "Klik, tik of druk op Enter om aan of uit te zetten",
    // Shown when the cahrt is busy loading something.
    "Loading": "Laden",
    // Shown as the first button in the breadcrumb navigation, e.g.:
    // Home > First level > ...
    "Home": "Home",
    // Chart types.
    // Those are used as default screen reader titles for the main chart element
    // unless developer has set some more descriptive title.
    "Chart": "Grafiek",
    "Serial chart": "Periodieke grafiek",
    "X/Y chart": "X-Y grafiek",
    "Pie chart": "Taartdiagram",
    "Gauge chart": "Meterdiagram",
    "Radar chart": "Radardiagram",
    "Sankey diagram": "Sankey-diagram",
    "TreeMap chart": "Treemap-grafiek",
    // Series types.
    // Used to name series by type for screen readers if they do not have their
    // name set.
    "Series": "Reeks",
    "Candlestick Series": "Candlestick-reeks",
    "Column Series": "Kolomreeks",
    "Line Series": "Lijnreeks",
    "Pie Slice Series": "Taartpuntreeks",
    "X/Y Series": "XY reeks",
    // Map-related stuff.
    "Map": "Kaart",
    "Press ENTER to zoom in": "Druk op Enter om in te zoomen",
    "Press ENTER to zoom out": "Druk op Enter om uit te zoomen",
    "Use arrow keys to zoom in and out": "Zoom in of uit met de pijltjestoetsen",
    "Use plus and minus keys on your keyboard to zoom in and out": "Zoom in of uit met de plus- en minustoetsen",
    // Export-related stuff.
    // These prompts are used in Export menu labels.
    //
    // "Export" is the top-level menu item.
    //
    // "Image", "Data", "Print" as second-level indicating type of export
    // operation.
    //
    // Leave actual format untranslated, unless you absolutely know that they
    // would convey more meaning in some other way.
    "Export": "Exporteren",
    "Image": "Afbeelding",
    "Data": "Data",
    "Print": "Printen",
    "Click, tap or press ENTER to open": "Klik, tik of druk op Enter om te openen",
    "Click, tap or press ENTER to print.": "Klik, tik of druk op Enter om te printen",
    "Click, tap or press ENTER to export as %1.": "Klik, tik of druk op Enter om te exporteren als %1",
    'To save the image, right-click this link and choose "Save picture as..."': 'Klik met de rechtermuisknop op deze link en kies "Afbeelding opslaan als..." om de afbeelding op te slaan',
    'To save the image, right-click thumbnail on the left and choose "Save picture as..."': 'Klik met de rechtermuisknop op de miniatuur links en kies "Afbeelding opslaan als..." om de afbeelding op te slaan',
    "(Press ESC to close this message)": "(Druk op ESC om dit bericht te sluiten)",
    "Image Export Complete": "Afbeelding exporteren gereed",
    "Export operation took longer than expected. Something might have gone wrong.": "Exportproces duurt langer dan verwacht. Er is misschien iets fout gegaan.",
    "Saved from": "Opgeslagen via:",
    "PNG": "PNG",
    "JPG": "JPG",
    "GIF": "GIF",
    "SVG": "SVG",
    "PDF": "PDF",
    "JSON": "JSON",
    "CSV": "CSV",
    "XLSX": "XLSX",
    // Scrollbar-related stuff.
    //
    // Scrollbar is a control which can zoom and pan the axes on the chart.
    //
    // Each scrollbar has two grips: left or right (for horizontal scrollbar) or
    // upper and lower (for vertical one).
    //
    // Prompts change in relation to whether Scrollbar is vertical or horizontal.
    //
    // The final section is used to indicate the current range of selection.
    "Use TAB to select grip buttons or left and right arrows to change selection": "Gebruik Tab om de hendels te selecteren of linker- en rechterpijltje om de selectie te veranderen",
    "Use left and right arrows to move selection": "Gebruik linker- en rechterpijltje om de selectie te verplaatsen",
    "Use left and right arrows to move left selection": "Gebruik linker- en rechterpijltje om de linkerselectie te verplaatsen",
    "Use left and right arrows to move right selection": "Gebruik linker- en rechterpijltje om de rechterselectie te verplaatsen",
    "Use TAB select grip buttons or up and down arrows to change selection": "Gebruik Tab om de hendels te selecteren of pijltje omhoog en omlaag om de selectie te veranderen",
    "Use up and down arrows to move selection": "Gebruik pijltje omhoog en omlaag om de selectie te verplaatsen",
    "Use up and down arrows to move lower selection": "Gebruik pijltje omhoog en omlaag om de onderste selectie te verplaatsen",
    "Use up and down arrows to move upper selection": "Gebruik pijltje omhoog en omlaag om de bovenste selectie te verplaatsen",
    "From %1 to %2": "Van %1 tot %2",
    "From %1": "Van %1",
    "To %1": "Tot %2",
    // Data loader-related.
    "No parser available for file: %1": "Geen data-parser beschikbaar voor dit bestand: %1",
    "Error parsing file: %1": "Fout tijdens parsen van bestand: %1",
    "Unable to load file: %1": "Kan bestand niet laden: %1",
    "Invalid date": "Ongeldige datum",
};
//# sourceMappingURL=nl_NL.js.map