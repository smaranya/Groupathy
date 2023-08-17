//Util funtions
// import AsyncStorage from '@react-native-community/async-storage';

/**
 * Returns the value of key within a object
 *
 * @param obj a non null object iside which key needs to be found
 * @param key a key name within object
 */
export const getKeyValue = <T, K extends keyof T>(obj: T, key: K): T[K] =>
  obj[key];

/**
 * Checks if passed email is valid or not
 * @param email
 * @returns true if email is valid false otherwise
 */
export const checkValidEmail = (email?: string): boolean => {
  if (!email) {
    return false;
  }
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const storeStringData = async (key: string, value: string) => {
  try {
    // await AsyncStorage.setItem(key, value);
  } catch (e) {
    return null;
  }
};

export const storeObjectData = async (key: string, value: object) => {
  try {
    const jsonValue = JSON.stringify(value);
    // await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    return null;
  }
};

export const getStringData = async (key: string) => {
  try {
    // const value = await AsyncStorage.getItem(key);
    //return value;
  } catch (e) {
    return null;
  }
};

export const getObjectData = async (key: string) => {
  try {
    // const jsonValue = await AsyncStorage.getItem(key);
    // return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    return null;
  }
};

export const capitalizeFirstLetter = (stringToCapitalize: string) => {
  if (!stringToCapitalize) {
    return '';
  }
  stringToCapitalize = stringToCapitalize.toLowerCase();
  return (
    stringToCapitalize.charAt(0).toUpperCase() + stringToCapitalize.slice(1)
  );
};

export const isUrl = (url?: string): boolean => {
  if (!url) {
    return false;
  }
  var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(url);
};

export const getTherapistNameArray = (): Array<string> => {
  return [
    'Dr. M J Thomas',
    'Dr Jamuna Neelamegan',
    'Dr. Srihari',
    'Dr. Hemendra Singh',
    'Farida Bharmal',
  ];
};

export const getTherapistImageArray = (): Array<string> => {
  return ['thomas', 'jamuna', 'sreehari', 'hemendra', ''];
};

export const getTherapistDegreeArray = (): Array<string> => {
  return [
    'MBBS, DPM, MD, MNAMS \n\nExperience: 25+ years',
    'MD(Medicina Alternativa) \nPh.D ( Medicinal Aromatherapy) \nTheraputic Yoga\n\nExperience: 18+ years',
    'MBBS, DPM\n\nExperience: 29+ years',
    'MBBS, MD\n\nExperience: 11+ years',
    'Therapist, Counsellor, \nSkill Trainer & Graphologist\n\nExperience: 2+ years',
  ];
};

export const getTherapistExperienceYearArray = (): Array<string> => {
  return ['25+ years', '18+ years', '29+ years', '11+ years', '2+ years'];
};

export const getTherapistExpertiseArray = (index: number): Array<string> => {
  switch (index) {
    case 0:
      return [
        'Depression',
        'Stress',
        'PTSD',
        'Alchoholism',
        'Dementia',
        'Eating Disorder',
        'Personality Disorder',
        'Sczophrenia',
      ];
    case 1:
      return ['Stress, Depression, Anxiety, OCD'];
    case 2:
      return ['Psychiatry'];
    case 3:
      return ['Psychiatry, Adult, Adolescent, Nuero Psychiatry, Addiction'];
    case 4:
      return [
        'Stress, Work related mental health issues, Depression, Social Anxiety',
      ];
    default:
      return [];
  }
};

export const getTherapistLanguageProficiencyArray = (): Array<string> => {
  return [
    'English, Malyalam, Kannada, Tamil',
    'English, Tamil',
    'Kannada, Hindi, Tamil, Telgu',
    'English, Hindi, Kannada, Malyalam',
    'English, Hindi, Gujrati',
  ];
};

export const getTherapistPhoneNumberArray = (): Array<string> => {
  return [
    '+91-9845003762 ',
    '+91-9886358276',
    '+91-9844015168',
    '+91-8971220731',
    '+91-9845676442',
  ];
};

export const checkValidPincode = (pincode: string) => {
  if (!pincode) {
    return false;
  }
  const re = /^[1-9][0-9]{5}$/;
  return re.test(String(pincode).toLowerCase());
};
