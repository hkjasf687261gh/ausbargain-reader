import React from "react";
import DealPageStateWrapper from "./DealPageStateWrapper";

type Props = {
  category: string;
};
const CategoryView = ({ category }: Props) => {
  return <DealPageStateWrapper dealType={"category"} category={category} />;
};

export default CategoryView;
