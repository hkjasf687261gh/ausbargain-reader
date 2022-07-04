import { RefresherEventDetail } from "@ionic/react";
import { useState } from "react";
import { dealDto } from "../helpers/dealDto";
import { OzbargainDeal } from "../types/OzbargainDeal";
import { PROXY_API_KEY, PROXY_URL } from "./constants";

export interface UseProxyFetchDeal {
  deal: OzbargainDeal | undefined;
  doRefresh: (
    nid: OzbargainDeal["nid"],
    event?: CustomEvent<RefresherEventDetail>
  ) => Promise<void>;
  initializePage: (nid: OzbargainDeal["nid"]) => Promise<void>;
  initialLoading: boolean;
  fetchDeal: (nid: OzbargainDeal["nid"]) => Promise<OzbargainDeal | undefined>;
}

function useProxyFetch(): UseProxyFetchDeal {
  const [initialLoading, setInitialLoading] = useState(true);
  const [deal, setDeal] = useState<OzbargainDeal | undefined>(undefined);

  async function initializePage(nid: OzbargainDeal["nid"]) {
    setDeal(undefined);
    setInitialLoading(true);
    await fetchDeal(nid);
    setInitialLoading(false);
  }

  async function doRefresh(
    nid: OzbargainDeal["nid"],
    event?: CustomEvent<RefresherEventDetail>
  ) {
    await initializePage(nid);

    if (event) {
      event.detail.complete();
    }
  }

  async function fetchDeal(nid: OzbargainDeal["nid"]) {
    const url = PROXY_URL + `/node/${nid}`;

    // Add date string to avoid cacheing
    const response = await fetch(`${url}&t=${new Date().getTime()}`, {
      headers: { authorization: PROXY_API_KEY },
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = (await response.text()) as string;
    const formattedDeal = dealDto(data);

    setDeal(formattedDeal);
    return formattedDeal;
  }

  return {
    deal,
    doRefresh,
    initialLoading,
    initializePage,
    fetchDeal,
  };
}

export default useProxyFetch;
