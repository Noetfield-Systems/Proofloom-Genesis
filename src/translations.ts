// Literal meaning-preserving localized interface strings, shared across all routes.
import fa from '../locales/fa.json';
import ar from '../locales/ar.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import de from '../locales/de.json';
import ptBR from '../locales/pt-BR.json';
import ru from '../locales/ru.json';
import zhCN from '../locales/zh-CN.json';
import hi from '../locales/hi.json';
import tr from '../locales/tr.json';
import id from '../locales/id.json';
import ja from '../locales/ja.json';
import ko from '../locales/ko.json';
import ur from '../locales/ur.json';
import bn from '../locales/bn.json';
import vi from '../locales/vi.json';
export const languageNames = {
 en:'English', fa:'فارسی', ar:'العربية', es:'Español', fr:'Français', de:'Deutsch', 'pt-BR':'Português (Brasil)', ru:'Русский', 'zh-CN':'简体中文', hi:'हिन्दी', tr:'Türkçe', id:'Bahasa Indonesia', ja:'日本語', ko:'한국어', ur:'اردو', bn:'বাংলা', vi:'Tiếng Việt'
} as const;
export type Locale = keyof typeof languageNames;
export const translations: Record<Locale, Record<string,string>> = {
 en:{},
 'fa':fa,
 'ar':ar,
 'es':es,
 'fr':fr,
 'de':de,
 'pt-BR':ptBR,
 'ru':ru,
 'zh-CN':zhCN,
 'hi':hi,
 'tr':tr,
 'id':id,
 'ja':ja,
 'ko':ko,
 'ur':ur,
 'bn':bn,
 'vi':vi
};
