import { OzbargainDeal } from "../types/OzbargainDeal";

// eslint-disable-next-line
const PRICE_REGEX = /\${1}(?:\d+)((\d{1,3})*([, ]\d{3})*)(\.\d+)?/gm;
// eslint-disable-next-line
const DATE_REGEX = /\d*\/\d*\/\d*\s\-\s\d*\:\d*|\d*\/\d*\/\d*/g;

/**
 * Matches:
 * browse page - '12/04/2021 - 08:08'
 * search page - '12/04/2021'
 */
export function matchDate(value: string) {
  const match = value.match(DATE_REGEX);
  if (!match || match.length === 0) return null;

  // eslint-disable-next-line
  let [date, time] = match[0].split(" - ");
  let [day, month, year] = date.split("/");
  const dateObj = new Date(`${year}-${month}-${day}`);

  if (time) {
    let [hour, minute] = time.split(":");
    dateObj.setHours(parseInt(hour, 10));
    dateObj.setMinutes(parseInt(minute, 10));
  }

  return dateObj;
}

export function formatSubmittedAt(
  submittingDate: OzbargainDeal["submittingDate"]
) {
  if (!submittingDate) return null;
  return new Date(submittingDate).toLocaleDateString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "2-digit",
  });
}

// e.g, 15 June
export function formatSubmittedAtDay(
  submittingDate: OzbargainDeal["submittingDate"]
) {
  if (!submittingDate) return null;
  return new Date(submittingDate).toLocaleDateString("en-AU", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

//
export function formatLongSubmittedAt(
  submittingDate: OzbargainDeal["submittingDate"]
) {
  if (!submittingDate) return null;
  return submittingDate.toLocaleDateString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
    weekday: "long",
    year: "numeric",
  });
}

export function formatTitle(title: string): (JSX.Element | string)[] {
  const matches = title.match(PRICE_REGEX);
  if (!matches) return [title];

  let updatedTitle: (JSX.Element | string)[] = [title];

  matches.forEach((price, index) => {
    const priceElement = (
      <span style={{ fontWeight: "bold", color: "red" }}>{price}</span>
    );

    if (index === 0) {
      updatedTitle = (updatedTitle[0] as string).split(price);
      updatedTitle.splice(1, 0, priceElement);
    } else {
      // we are assuming that the regex found the "price" matches in order in the string.
      // so the last item in the array will always be the 'rest of the string' after the last match.
      const lastItem: string = updatedTitle.pop() as string;
      let lastItemArray: (JSX.Element | string)[] = [];

      try {
        lastItemArray = lastItem.split(price);
        lastItemArray.splice(1, 0, priceElement);
      } catch (e) {}

      updatedTitle = [...updatedTitle, ...lastItemArray];
    }
  });

  return updatedTitle.map((item, index) => (
    <span key={`title + ${index}` + title}>{item}</span>
  ));
}

export function formatSubtitle(deal: OzbargainDeal): JSX.Element {
  return (
    <>
      {deal.username} - {formatLongSubmittedAt(deal.submittingDate)}{" "}
      {deal.dealDomain && (
        <>
          - <strong>{deal.dealDomain}</strong>
        </>
      )}
    </>
  );
}

const relativeTimePeriods = [
  [31536000, "year"],
  [2419200, "month"],
  [604800, "week"],
  [86400, "day"],
  // I dont need these
  // [3600, "hour"],
  // [60, "minute"],
  // [1, "second"],
];

export function relativeTime(date: Date, isUtc = true) {
  if (!(date instanceof Date)) date = new Date(date * 1000);
  const seconds = ((new Date() as any) - (date as any)) / 1000;
  for (let [secondsPer, name] of relativeTimePeriods) {
    if (seconds >= secondsPer) {
      const amount = Math.floor(seconds / (secondsPer as number));
      return `${amount} ${name}${amount ? "s" : ""} ago`;
    }
  }
  return "Today";
}
