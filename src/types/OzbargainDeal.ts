export type OzbargainPageType =
  | "frontpage"
  | "new deals"
  | "category"
  | "search";

type Tag = {
  name: string;
  url: string;
};

export type Comment = {
  id: string;
  username: string;
  date: string;
  content: string;
  userVoted: "none" | "pos" | "neg";
  recievedVotes?: string;
  recievedVotesType?: "none" | "pos" | "neg";
  comments: Comment[];
};

export interface OzbargainDeal {
  nid: string;
  title: string;
  content: string;
  coupon?: string | null;
  username?: string | null;
  associated?: boolean;
  referrer?: boolean;
  submittingDate?: Date | null;
  dealDomain?: string | null;
  ozbargainDealUrl?: string;
  commentCount?: string | null;
  imageUrl?: string | null;
  tags: Tag[];
  isFreebie?: boolean;
  expiryDate?: string | null;
  expiryDateIn?: string | null;
  expiredTag?: string | null;
  clicks?: string;
  comments?: Comment[];
  votePositive?: string;
  voteNegative?: string;
  viewed?: boolean;
  highlighted?: boolean;
}

export type Ozbargainlink = Pick<
  OzbargainDeal,
  "commentCount" | "isFreebie" | "expiryDate" | "expiryDateIn" | "tags"
>;
