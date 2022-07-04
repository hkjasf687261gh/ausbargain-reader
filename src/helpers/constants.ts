import {
  airplaneOutline,
  bagAddOutline,
  basketballOutline,
  beerOutline,
  bookmarkOutline,
  bookmarkSharp,
  bookOutline,
  carOutline,
  cartOutline,
  fastFoodOutline,
  flameOutline,
  flameSharp,
  flashlightOutline,
  gameControllerOutline,
  globeOutline,
  helpOutline,
  laptopOutline,
  leafOutline,
  pawOutline,
  phonePortraitOutline,
  rocketOutline,
  schoolOutline,
  searchOutline,
  searchSharp,
  shirtOutline,
  storefrontOutline,
  storefrontSharp,
  tvOutline,
  walletOutline,
} from "ionicons/icons";
import { OzbargainDeal } from "../types/OzbargainDeal";
import generateBuildNumber from './build-number';

export const APP_NAME = "AusBargain Reader"

export const APP_VERSION = process.env["REACT_APP_VERSION_BUILD"] || "1.0.0"
export const APP_BUILD = generateBuildNumber({ version: APP_VERSION, versionSeparator: '-' })

export const ozBargainDealUrl = (nid: OzbargainDeal["nid"]) => {
  return OZBARGAIN_URL + `/node/${nid}`;
};

export const goToDealUrl = (nid: OzbargainDeal["nid"]) => {
  return OZBARGAIN_URL + `/goto/${nid}`;
};

export const OZBARGAIN_URL = "https://www.ozbargain.com.au";
export const PROXY_API_KEY = process.env["REACT_APP_PROXY_API_KEY"] || "";
const PROXY_URL_PROD = process.env["REACT_APP_PROXY_URL_PROD"] || '';
const PROXY_URL_LOCAL = "http://localhost:3000";
export const PROXY_URL =
  process.env["REACT_APP_USE_LOCAL_PROXY"] === "true"
    ? PROXY_URL_LOCAL
    : PROXY_URL_PROD;

export const CATEGORIES: {
  id: string,
  path: string,
  title: string,
  icon: string,
  favorite?: boolean
}[] = [
    {
      id: "alcohol",
      path: "/cat/alcohol",
      title: "Alcohol",
      icon: beerOutline,
    },
    {
      id: "automotive",
      path: "/cat/automotive",
      title: "Automotive",
      icon: carOutline,
    },
    {
      id: "books-magazines",
      path: "/cat/books-magazines",
      title: "Books & Magazines",
      icon: bookOutline,
    },
    {
      id: "computing",
      path: "/cat/computing",
      title: "Computing",
      icon: laptopOutline,
    },
    {
      id: "dining-takeaway",
      path: "/cat/dining-takeaway",
      title: "Dining & Takeaway",
      icon: fastFoodOutline,
    },
    {
      id: "education",
      path: "/cat/education",
      title: "Education",
      icon: schoolOutline,
    },
    {
      id: "electrical-electronics",
      path: "/cat/electrical-electronics",
      title: "Electrical & Electronics",
      icon: flashlightOutline,
    },
    {
      id: "entertainment",
      path: "/cat/entertainment",
      title: "Entertainment",
      icon: tvOutline,
    },
    {
      id: "fashion-apparel",
      path: "/cat/fashion-apparel",
      title: "Fashion & Apparel",
      icon: shirtOutline,
    },
    {
      id: "financial",
      path: "/cat/financial",
      title: "Financial",
      icon: walletOutline,
    },
    {
      id: "gaming",
      path: "/cat/gaming",
      title: "Gaming",
      icon: gameControllerOutline,
    },
    {
      id: "groceries",
      path: "/cat/groceries",
      title: "Groceries",
      icon: cartOutline,
    },
    {
      id: "health-beauty",
      path: "/cat/health-beauty",
      title: "Health & Beauty",
      icon: bagAddOutline,
    },
    {
      id: "home-garden",
      path: "/cat/home-garden",
      title: "Home & Garden",
      icon: leafOutline,
    },
    {
      id: "internet",
      path: "/cat/internet",
      title: "Internet",
      icon: globeOutline,
    },
    {
      id: "mobile",
      path: "/cat/mobile",
      title: "Mobile",
      icon: phonePortraitOutline,
    },
    {
      id: "other",
      path: "/cat/other",
      title: "Other",
      icon: helpOutline,
    },
    {
      id: "pets",
      path: "/cat/pets",
      title: "Pets",
      icon: pawOutline,
    },
    {
      id: "sports-outdoors",
      path: "/cat/sports-outdoors",
      title: "Sports & Outdoors",
      icon: basketballOutline,
    },
    {
      id: "toys-kids",
      path: "/cat/toys-kids",
      title: "Toys & Kids",
      icon: rocketOutline,
    },
    {
      id: "travel",
      path: "/cat/travel",
      title: "Travel",
      icon: airplaneOutline,
    },
  ];

export interface AppPage {
  id: string;
  url: string;
  iosIcon?: string;
  mdIcon?: string;
  title: string;
}

export const pageMeta = {
  frontPage: {
    id: "frontPage",
    title: "Frontpage",
    url: "/frontpage",
    iosIcon: storefrontOutline,
    mdIcon: storefrontSharp,
  },
  newDeals: {
    id: "newDeals",
    title: "New Deals",
    url: "/new-deals",
    iosIcon: flameOutline,
    mdIcon: flameSharp,
  },
  saved: {
    id: "saved",
    title: "Saved",
    url: "/saved",
    iosIcon: bookmarkOutline,
    mdIcon: bookmarkSharp,
  },
  search: {
    id: "search",
    title: "Search",
    url: "/search",
    iosIcon: searchOutline,
    mdIcon: searchSharp,
  },
};
