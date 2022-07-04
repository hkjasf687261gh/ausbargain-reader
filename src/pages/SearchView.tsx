import { IonSearchbar } from "@ionic/react";
import { useState } from "react";
import useProxyFetch from "../helpers/useProxyFetch";
import DealsPage from "./DealsPage";

const SearchView = () => {
  const [search, setSearch] = useState("");
  const {
    deals,
    fetchNextPage,
    pageTitle,
    initialLoading,
    doSearch,
    filteredDealsTotal,
  } = useProxyFetch({
    dealType: "search",
  });

  async function handleFetch(newSearch: string, ev?: any) {
    if (newSearch && newSearch.length > 0) {
      await doSearch(newSearch);
    }
    if (ev) {
      ev.detail.complete();
    }
    setSearch(newSearch);
  }

  return (
    <DealsPage
      deals={deals}
      fetchNextPage={async (ev) => await fetchNextPage(ev, search)}
      doRefresh={async (ev) => await handleFetch(search, ev)}
      pageTitle={pageTitle}
      initialLoading={initialLoading}
      filteredDealsTotal={filteredDealsTotal}
      toolbarChildren={
        <IonSearchbar
          onIonChange={(e) => handleFetch(e.detail.value!)}
          animated
          showCancelButton="focus"
          autocorrect="off"
          enterkeyhint="search"
          placeholder="Eneloops..."
        ></IonSearchbar>
      }
    ></DealsPage>
  );
};

export default SearchView;
