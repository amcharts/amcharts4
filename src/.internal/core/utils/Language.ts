﻿/**
 * Language module contains everything related to language-specific operations:
 * * Translating prompts
 * * Translating functions
 * * Date format localizations
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObjectEvents, IBaseObjectEvents } from "../Base";
import { Adapter } from "./Adapter";
import { AMEvent } from "./EventDispatcher";
import * as $array from "./Array";
import * as $type from "./Type";
import en from "../../../lang/en";
import { options } from "../Options";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines events for [[Language]].
 */
export interface ILanguageEvents extends IBaseObjectEvents {

	/**
	 * Invoked when locale is changed by user.
	 */
	localechanged: {
		locale: ILocale;
	};

};


/**
 * Defines properties that exist for the locale.
 */
export interface ILocaleProperties {
	// number formatter related
	"_decimalSeparator"?: string;
	"_thousandSeparator"?: string;

	"_percentPrefix"?: string | null;
	"_percentSuffix"?: string | null;

	"_big_number_suffix_3"?: string;
	"_big_number_suffix_6"?: string;
	"_big_number_suffix_9"?: string;
	"_big_number_suffix_12"?: string;
	"_big_number_suffix_15"?: string;
	"_big_number_suffix_18"?: string;
	"_big_number_suffix_21"?: string;
	"_big_number_suffix_24"?: string;

	"_small_number_suffix_24"?: string;
	"_small_number_suffix_21"?: string;
	"_small_number_suffix_18"?: string;
	"_small_number_suffix_15"?: string;
	"_small_number_suffix_12"?: string;
	"_small_number_suffix_9"?: string;
	"_small_number_suffix_6"?: string;
	"_small_number_suffix_3"?: string;

	"_byte_suffix_B"?: string;
	"_byte_suffix_KB"?: string;
	"_byte_suffix_MB"?: string;
	"_byte_suffix_GB"?: string;
	"_byte_suffix_TB"?: string;
	"_byte_suffix_PB"?: string;

	// Default date formats for various periods
	"_date"?: string;
	"_date_millisecond"?: string;
	"_date_second"?: string;
	"_date_minute"?: string;
	"_date_hour"?: string;
	"_date_day"?: string;
	"_date_week"?: string;
	"_date_month"?: string;
	"_date_year"?: string;

	// Default duration formats for various base units
	"_duration_millisecond"?: string;
	"_duration_millisecond_second"?: string;
	"_duration_millisecond_minute"?: string;
	"_duration_millisecond_hour"?: string;
	"_duration_millisecond_day"?: string;
	"_duration_millisecond_week"?: string;
	"_duration_millisecond_month"?: string;
	"_duration_millisecond_year"?: string;

	"_duration_second"?: string;
	"_duration_second_minute"?: string;
	"_duration_second_hour"?: string;
	"_duration_second_day"?: string;
	"_duration_second_week"?: string;
	"_duration_second_month"?: string;
	"_duration_second_year"?: string;

	"_duration_minute"?: string;
	"_duration_minute_hour"?: string;
	"_duration_minute_day"?: string;
	"_duration_minute_week"?: string;
	"_duration_minute_month"?: string;
	"_duration_minute_year"?: string;

	"_duration_hour"?: string;
	"_duration_hour_day"?: string;
	"_duration_hour_week"?: string;
	"_duration_hour_month"?: string;
	"_duration_hour_year"?: string;

	"_duration_day"?: string;
	"_duration_day_week"?: string;
	"_duration_day_month"?: string;
	"_duration_day_year"?: string;

	"_duration_week"?: string;
	"_duration_week_month"?: string;
	"_duration_week_year"?: string;

	"_duration_month"?: string;
	"_duration_month_year"?: string;

	"_duration_year"?: string;

	// Era
	"_era_ad"?: string;
	"_era_bc"?: string;

	// Period
	"A"?: string;
	"P"?: string;
	"AM"?: string;
	"PM"?: string;
	"A.M."?: string;
	"P.M."?: string;

	// Dates
	"January"?: string;
	"February"?: string;
	"March"?: string;
	"April"?: string;
	"May"?: string;
	"June"?: string;
	"July"?: string;
	"August"?: string;
	"September"?: string;
	"October"?: string;
	"November"?: string;
	"December"?: string;
	"Jan"?: string;
	"Feb"?: string;
	"Mar"?: string;
	"Apr"?: string;
	"May(short)"?: string;
	"Jun"?: string;
	"Jul"?: string;
	"Aug"?: string;
	"Sep"?: string;
	"Oct"?: string;
	"Nov"?: string;
	"Dec"?: string;
	"Sunday"?: string;
	"Monday"?: string;
	"Tuesday"?: string;
	"Wednesday"?: string;
	"Thursday"?: string;
	"Friday"?: string;
	"Saturday"?: string;
	"Sun"?: string;
	"Mon"?: string;
	"Tue"?: string;
	"Wed"?: string;
	"Thu"?: string;
	"Fri"?: string;
	"Sat"?: string;

	// Chart elements
	"Zoom Out"?: string;
	"Play"?: string;
	"Stop"?: string;
	"Legend"?: string;
	"Click, tap or press ENTER to toggle"?: string;
	"Loading"?: string;
	"%1 shown"?: string;
	"%1 hidden"?: string;

	// Chart types
	"Chart"?: string;
	"Serial chart"?: string;
	"X/Y chart"?: string;
	"Pie chart"?: string;
	"Sunburst chart"?: string;
	"Gauge chart"?: string;
	"Radar chart"?: string;
	"Sankey diagram"?: string;
	"Flow diagram"?: string;
	"Chord diagram"?: string;
	"TreeMap chart"?: string;
	"Force directed tree"?: string;
	"Sliced chart"?: string;

	// Series types
	"Series"?: string;
	"Candlestick Series"?: string;
	"OHLC Series"?: string;
	"Column Series"?: string;
	"Line Series"?: string;
	"Pie Slice Series"?: string;
	"Funnel Series"?: string;
	"Pyramid Series"?: string;
	"X/Y Series"?: string;

	// Map-related
	"Map"?: string;
	"Press ENTER to zoom in"?: string;
	"Press ENTER to zoom out"?: string;
	"Use arrow keys to zoom in and out"?: string;
	"Use plus and minus keys on your keyboard to zoom in and out"?: string;
	"Home"?: string;
	"Zoom level changed to %1"?: string;

	// Export-related
	"Export"?: string;
	"Image"?: string;
	"Data"?: string;
	"Print"?: string;
	"Press ENTER or use arrow keys to navigate"?: string;
	"Click, tap or press ENTER to open"?: string;
	"Click, tap or press ENTER to print."?: string;
	"Click, tap or press ENTER to export as %1."?: string;
	'To save the image, right-click this link and choose "Save picture as..."': string;
	'To save the image, right-click thumbnail on the left and choose "Save picture as..."': string;
	"(Press ESC to close this message)"?: string;
	"Image Export Complete"?: string;
	"Export operation took longer than expected. Something might have gone wrong."?: string;
	"Saved from"?: string;
	"PNG"?: string;
	"JPG"?: string;
	"GIF"?: string;
	"SVG"?: string;
	"PDF"?: string;
	"JSON"?: string;
	"CSV"?: string;
	"XLSX"?: string;

	// Scrollbar-related
	"Use TAB to select grip buttons or left and right arrows to change selection"?: string;
	"Use left and right arrows to move selection"?: string;
	"Use left and right arrows to move left selection"?: string;
	"Use left and right arrows to move right selection"?: string;
	"Use TAB select grip buttons or up and down arrows to change selection"?: string;
	"Use up and down arrows to move selection"?: string;
	"Use up and down arrows to move lower selection"?: string;
	"Use up and down arrows to move upper selection"?: string;
	"From %1 to %2"?: string;
	"From %1"?: string;
	"To %1"?: string;

	// Data loader-related
	"No parser available for file: %1"?: string;
	"Error parsing file: %1"?: string;
	"Unable to load file: %1"?: string;
	"Invalid date"?: string;

	// Common actions
	"Close"?: string;
	"Minimize"?: string;

	"Venn Series"?: string;
	"Venn Diagram"?: string;
}

/**
 * Defines functions that exist for the locale.
 */
export interface ILocaleFunctions {
	// ordinal function
	"_dateOrd": (day: number) => string;
}

/**
 * Defines all of the defaults for locale properties.
 */
export interface ILocaleDefault extends ILocaleProperties, ILocaleFunctions { }

/**
 * Defines locale interface.
 */
export interface ILocale extends Partial<ILocaleDefault> { };

/**
 * Represents a list of available adapters for Language.
 */
export interface ILanguageAdapters {

	/**
	 * Applied to result whenever retrieving currently set locale.
	 */
	locale: {
		locale: ILocale
	},

	/**
	 * Applied to a translation.
	 */
	translate: {
		translation: string,
		locale?: ILocale
	},

	/**
	 * Applied to all of the locale translations.
	 */
	translations: {
		translations: any,
		locale?: ILocale
	}

}

/**
 * Handles all language-related tasks, like loading and storing translations,
 * translating prompts, lists of prompts and even functions.
 *
 * Almost every object in amCharts4 universe will have a `language` property,
 * which can be accessed for prompt translation.
 *
 * @see {@link ILanguageAdapters} for a list of available Adapters
 * @todo Make prompt keys case-insensitive
 * @important
 */
export class Language extends BaseObjectEvents {
	/**
	 * Defines type used in the Sprite.
	 */
	public _adapter!: ILanguageAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ILanguageEvents;

	/**
	 * Adapter.
	 */
	public adapter: Adapter<this, this["_adapter"]> = new Adapter(this);

	/**
	 * Current locale.
	 */
	protected _locale: ILocale = en;

	/**
	 * Default locale. A locale to fall back to if none is specified, or
	 * if there's no translation for the prompt for the current language.
	 */
	protected _defaultLocale: ILocaleDefault = en;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "Language";

		// Set default language if necessary
		if ($type.hasValue(options.defaultLocale)) {
			this.locale = options.defaultLocale;
		}

		this.applyTheme();
	}

	/**
	 * Returns locale that is currently used.
	 *
	 * @param locale  Force locale. Will use current language if not set.
	 * @return Locale
	 */
	protected getLocale(locale?: ILocale): ILocale {
		if (locale == null) {
			locale = this._locale;
		}

		return this.adapter.apply("locale", {
			locale: locale
		}).locale;
	}

	/**
	 * Returns the translation of the string.
	 *
	 * If the translation is empty, it will return untranslated prompt.
	 *
	 * Third parameter and up are strings that can be used to replace "%X"
	 * placeholders in prompt.
	 *
	 * E.g.:
	 *
	 * ```TypeScript
	 * // Results in "This is a first translation test"
	 * chart.language.translate("This is a %1 translation %2", null, "first", "test");
	 * ```
	 * ```JavaScriptScript
	 * // Results in "This is a first translation test"
	 * chart.language.translate("This is a %1 translation %2", null, "first", "test");
	 * ```
	 *
	 * @param  prompt   A string to translate
	 * @param  locale   Force translation into specific locale, e.g. fr_FR
	 * @param  rest     Parameters to replace in string
	 * @return          Translation
	 */
	public translate<Key extends keyof ILocaleProperties>(prompt: Key, locale?: ILocale, ...rest: Array<string>): string {

		// Get langauge
		locale = this.getLocale(locale);

		// Init translation
		let translation: string = prompt;

		// Get translations for the locale
		let translations = this.getTranslations(locale);

		let value: $type.Optional<ILocaleDefault[Key]> = translations[prompt];

		// Try to look for the translation
		if (value === null) {
			translation = "";
		}
		else if ($type.hasValue(value)) {
			// It might be an empty string
			if (value) {
				translation = value!;
			}
		}
		else if (locale !== this._defaultLocale) {
			// Try to look in default language
			return this.translate(prompt, this._defaultLocale, ...rest);
		}

		// Replace %1, %2, etc params
		if (rest.length) {
			for (let len = rest.length, i = 0; i < len; ++i) {
				translation = translation.split("%" + (i + 1)).join(rest[i]);
			}
		}

		// Return the translation
		return this.adapter.apply("translate", {
			translation: translation,
			locale: locale
		}).translation;
	}

	/**
	 * Non-type-checked translation.
	 *
	 * Can be used by plugins and other code that may have their own non-standard
	 * translation prompts.
	 *
	 * @since 4.5.5
	 * @param  prompt   A string to translate
	 * @param  locale   Force translation into specific locale, e.g. fr_FR
	 * @param  rest     Parameters to replace in string
	 * @return          Translation
	 */
	public translateAny(prompt: string, locale?: ILocale, ...rest: Array<string>): string {
		return this.translate(<any>prompt, locale, ...rest);
	}

	/**
	 * Sets a prompt translation.
	 *
	 * @since 4.9.35
	 * @param  prompt       Prompt in English
	 * @param  translation  Translation
	 * @param  locale       Locale
	 */
	public setTranslationAny(prompt: string, translation: string, locale?: ILocale): void {
		const localeTarget = locale || this.locale;
		(<any>localeTarget)[prompt] = translation;
	}

	/**
	 * Translates prompt.
	 *
	 * If translation is empty, it will return empty string, which is a different
	 * behavior than that of regular `translate`.
	 *
	 * @param prompt   A string to translate
	 * @param locale   Force translation into specific locale, e.g. fr_FR
	 * @param ...rest  Parameters to replace in string
	 * @return Translation
	 */
	public translateEmpty<Key extends keyof ILocaleProperties>(prompt: Key, locale?: ILocale, ...rest: Array<string>): string {
		let translation = this.translate(prompt, locale, ...rest);
		return translation == prompt ? "" : translation;
	}

	/**
	 * Translates a function.
	 *
	 * This method will return a function reference, but will not run it. It's
	 * up to the caller script to run the function.
	 *
	 * @param prompt  A function id to translate
	 * @param locale  Force translation into specific locale. e.g. fr_FR
	 * @return A language-specific version of the function
	 * @todo Apply adapter
	 */
	public translateFunc<Key extends keyof ILocaleFunctions>(prompt: Key, locale?: ILocale): ILocaleFunctions[Key] {

		// Get langauge
		locale = this.getLocale(locale);

		// Get translations for the locale
		let translations = this.getTranslations(locale);

		let value: $type.Optional<ILocaleFunctions[Key]> = translations[prompt];

		// Try to look for the translation
		if (value != null) {
			return value;
		}

		// Try to look in default language
		if (locale !== this._defaultLocale) {
			return this.translateFunc(prompt, this._defaultLocale);
		}

		// Fail - return empty function
		return (): string => {
			return "";
		};
	}

	/**
	 * Translates a list of prompts in one go.
	 *
	 * @param list    An array of strings to translate
	 * @param locale  Force translation into specific locale. e.g. fr_FR
	 * @return An array of translated strings in the same order as source list
	 */
	public translateAll<Key extends keyof ILocaleProperties>(list: Array<Key>, locale?: ILocale): Array<string> {
		// Translate all items in the list
		if (!this.isDefault()) {
			return $array.map(list, (x) => this.translate(x, locale));

		} else {
			return list;
		}
	}

	/**
	 * Returns `true` if the currently selected locale is a default locale.
	 *
	 * @return `true` if locale is default; `false` if it is not.
	 */
	public isDefault(): boolean {
		return this._defaultLocale === this._locale;
	}

	/**
	 * Current locale.
	 *
	 * @param value  Locale definition (translations)
	 */
	public set locale(value: ILocale) {
		if (this._locale != value) {
			this._locale = value;


			if (this.events.isEnabled("localechanged")) {
				const event: AMEvent<this, ILanguageEvents>["localechanged"] = {
					type: "localechanged",
					locale: value,
					target: this
				};
				this.events.dispatchImmediately("localechanged", event);
			}
		}
	}

	/**
	 * @return Locale definition
	 */
	public get locale(): ILocale {
		return this._locale;
	}

	/**
	 * Returns translations for a given locale.
	 *
	 * @ignore
	 * @deprecated
	 * @param locale  Locale
	 * @return Translations
	 */
	public getTranslations(locale: ILocale): ILocale {
		return this.adapter.apply("translations", {
			translations: locale,
			locale: locale
		}).translations;
	}

}
