import i18n from 'i18next';
import{initReactI18next} from 'react-i18next';
import en from "./en.json"

i18n.use(initReactI18next).init({
    resources: {
      en: {
        translation:{
            en
        }
      },
      ro: {
        translation: {
          'signUp': "Inregistreaza-te",
          'userName': "Nume de utilizator",
          'email' : "Adresa de email",
          'password' : "Parola",
          'passwordRepeat' : "Repeta parola"
        }
      }
    },
    lng: 'en', 
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

  export default i18n;