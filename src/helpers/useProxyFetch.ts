import { RefresherEventDetail } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { FiltersContext } from "../contexts/FiltersContexts";
import { dealsDto, searchDealsDto } from "../helpers/dealDto";
import { OzbargainDeal, OzbargainPageType } from "../types/OzbargainDeal";
import { CATEGORIES, PROXY_API_KEY, PROXY_URL } from "./constants";
import { applyFilters } from "./filters";

type Props = {
  dealType: OzbargainPageType;
  category?: string;
};

type PageNumber = number;

export interface UseProxyFetch {
  deals: OzbargainDeal[];
  pageTitle: string;
  fetchNextPage: (ev: any, search?: string) => Promise<void>;
  doRefresh: (event: CustomEvent<RefresherEventDetail>) => Promise<void>;
  initialLoading: boolean;
  doSearch: (search: string) => Promise<void>;
  filteredDealsTotal: number;
}

const searchType = {
  deals: "t=b",
  dealsNotExpired: "t=e",
};

function useProxyFetch({ dealType, category }: Props): UseProxyFetch {
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<PageNumber>(1);
  const [deals, setDeals] = useState<OzbargainDeal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<OzbargainDeal[]>([]);
  const [lastTts, setLastTts] = useState("");
  const { filters } = useContext(FiltersContext);

  useEffect(() => {
    reinitPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function filterDeals() {
      const result = await applyFilters(deals, filters);
      setFilteredDeals(result);
    }

    filterDeals();
  }, [deals, filters]);

  function getDealTypePageUrl(
    dealType: OzbargainPageType,
    pageNumber: PageNumber,
    search?: string
  ) {
    switch (dealType) {
      case "frontpage":
        return `/?page=${pageNumber - 1}`;
      case "search":
        return `/search/node/${search}?page=${pageNumber - 1}&${
          searchType.deals
        }`;
      case "new deals":
        if (pageNumber === 1) {
          return "/deals";
        } else {
          // lastnid = last node id (deal id, same as the `goto url`)
          const lastDeal = deals[deals.length - 1];
          return `/ozbapi/nodes/list?lastnid=${
            lastDeal.nid
          }&lastts=${lastTts}&type=deals&page=${pageNumber - 1}`;
        }
      case "category":
        return `/cat/${category}?page=${pageNumber - 1}`;
      default:
        break;
    }
  }

  function getUrl(pageNumber: PageNumber, search?: string) {
    return PROXY_URL + getDealTypePageUrl(dealType, pageNumber, search);
  }

  async function reinitPage() {
    setInitialLoading(true);
    if (dealType !== "search") {
      await fetchData(1);
    }
    setInitialLoading(false);
  }

  async function doSearch(search: string) {
    setCurrentPage(1);
    setDeals([]);
    setInitialLoading(true);
    await fetchData(1, search);
    setInitialLoading(false);
  }

  async function fetchNextPage(ev: any, search?: string) {
    await fetchData(currentPage + 1, search);
    if (ev) ev.target.complete();
  }

  async function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    await reinitPage();
    event.detail.complete();
  }

  async function fetchData(pageNumber: PageNumber, search?: string) {
    const url = getUrl(pageNumber, search);

    // Add date string to avoid cacheing
    const response = await fetch(`${url}&cache=${new Date().getTime()}`, {
      headers: { authorization: PROXY_API_KEY },
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = (await response.text()) as string;

    // Parse HTML into array of OzbargainDeal objects
    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(data, "text/html");
    const main = parsedHtml.getElementById("main");

    let formattedDeals: OzbargainDeal[] = [];

    if (dealType === "search" && main) {
      formattedDeals = searchDealsDto(main);
    } else {
      // Infinate scroll content does not have a `main` sub
      const dealsHtml = (main || parsedHtml)?.getElementsByClassName(
        "node node-ozbdeal node-teaser"
      );

      // The `lastts` attribute of the last page fetch is required to return the next pages for New Deals
      if (dealType === "new deals") {
        const scrapedNextPageUrl = parsedHtml
          .getElementsByClassName("infscroll notloaded")
          .item(0)
          ?.attributes.getNamedItem("data-src")?.value;
        if (scrapedNextPageUrl) {
          const parsedUrl = new URL(`http://example.com${scrapedNextPageUrl}`);
          setLastTts(parsedUrl.searchParams.get("lastts") || "");
        }
      }

      if (!dealsHtml) return [];

      formattedDeals = dealsDto(dealsHtml);
    }

    if (pageNumber === 1) {
      setDeals(formattedDeals);
    } else {
      setDeals((cachedDeals) => [...cachedDeals, ...formattedDeals]);
    }

    setCurrentPage(pageNumber);
  }

  function getPageTitle() {
    switch (dealType) {
      case "frontpage":
        return "Frontpage";
      case "search":
        return "Search";
      case "new deals":
        return "New Deals";
      case "category":
        return (
          CATEGORIES.find((categoryData) => categoryData.id === category)
            ?.title || "OzBargain"
        );
      default:
        return "OzBargain";
    }
  }

  return {
    pageTitle: getPageTitle(),
    filteredDealsTotal: deals.length - filteredDeals.length,
    deals: filteredDeals,
    fetchNextPage,
    doSearch,
    doRefresh,
    initialLoading,
  };
}

export default useProxyFetch;
