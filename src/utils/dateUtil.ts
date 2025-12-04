/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import updateLocale from 'dayjs/plugin/updateLocale';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';

export function formatToDateTime(date?: dayjs.ConfigType, format = DATE_TIME_FORMAT): string {
  return dayjs(date).format(format);
}

export function formatToDate(date?: dayjs.ConfigType, format = DATE_FORMAT): string {
  return dayjs(date).format(format);
}

export const dateUtil = dayjs;

const localeEn = {
  weekStart: 1,
  name: 'en',
};
const localeZh = {
  weekStart: 1,
  name: 'zh',
};

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(updateLocale);
dayjs.updateLocale(localeEn.name, localeEn);
dayjs.updateLocale(localeZh.name, localeZh);

export const dateUtilManila = dayjs;
export const formatToAge = (date: dayjs.ConfigType) => {
  const now = dayjs();
  const age = now.diff(date, 'year');
  return age;
};

export const formatBirthdayToDateTime = (birthday?: number | null) => {
  if (birthday) {
    const numberOfBirthday = Number(birthday);
    return numberOfBirthday ? formatToDate(birthday * 1000) : undefined;
  }
  return undefined;
};

export const formatToTargetUTCDate = (timestamp: number ,UTCNumver: string = '-0400') => {
  return dayjs(timestamp).tz(UTCNumver).format('YYYY-MM-DD HH:mm:ss');
}
