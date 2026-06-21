import en from 'src/i18n/en'
import zhTW from 'src/i18n/zh-TW'

/** All bundled locale message catalogs. */
export const messages = { en, 'zh-TW': zhTW }

export type AppLocale = keyof typeof messages

/** Locales offered in the switcher, in display order. */
export const SUPPORTED_LOCALES: AppLocale[] = ['en', 'zh-TW']

/** localStorage key the chosen locale is persisted under. */
export const LOCALE_STORAGE_KEY = 'nitra-locale'
