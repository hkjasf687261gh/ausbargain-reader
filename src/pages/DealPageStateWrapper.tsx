import React from "react";
import useProxyFetch from "../helpers/useProxyFetch";
import { OzbargainPageType } from "../types/OzbargainDeal";
import DealsPage from "./DealsPage";

type Props = {
  dealType: OzbargainPageType;
  category?: string;
};

const DealPageStateWrapper = ({ dealType, category }: Props) => {
  const {
    deals,
    fetchNextPage,
    doRefresh,
    pageTitle,
    initialLoading,
    filteredDealsTotal,
  } = useProxyFetch({
    dealType,
    category,
  });

  return (
    <DealsPage
      deals={deals}
      fetchNextPage={fetchNextPage}
      doRefresh={doRefresh}
      pageTitle={pageTitle}
      initialLoading={initialLoading}
      filteredDealsTotal={filteredDealsTotal}
    />
  );
};

export default DealPageStateWrapper;
