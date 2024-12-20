
export const monthsId = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function getMonthId(self: Date) {
  return monthsId[self.getMonth()]
}

export function getMonthIdSliced(self: Date) {
  return getMonthId(self).slice(0,3)
}

export function format(self: Date) {
  return `${self.getDate()} ${getMonthIdSliced(self)} ${self.getFullYear()}`
}

export default {
  monthsId, getMonthId, getMonthIdSliced, format
};
