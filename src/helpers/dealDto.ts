import { Comment, OzbargainDeal, Ozbargainlink } from "../types/OzbargainDeal";
import { matchDate } from "./formatters";

type NRight = Element | null | undefined;
type NLeft = NRight;

const initDeal: OzbargainDeal = { title: "", content: "", nid: "", tags: [] };

export function dealDto(html: string): OzbargainDeal | undefined {
  const parser = new DOMParser();
  const parsedHtml = parser.parseFromString(html, "text/html");
  const main = parsedHtml.getElementById("main");
  if (!main) return undefined;

  const node = main
    .getElementsByClassName("node node-ozbdeal node-page")
    .item(0);

  if (!node) return undefined;

  const nLeft = node.children.item(0);
  const nRight = node.children.item(1);

  if (!nLeft || !nRight) return undefined;

  let deal: OzbargainDeal = { title: "", content: "", nid: "", tags: [] };
  deal.title = getTitleForDeal(parsedHtml);
  deal = assignSharedDealData(deal, nLeft, nRight);
  deal.clicks = getDealClicks(nRight);

  const footerEl = main.getElementsByClassName("nodefooter").item(0);
  if (footerEl) {
    deal.tags = getDealTags(footerEl);
  }

  const commentsEl = main.getElementsByClassName("comment level0").item(0);
  if (commentsEl) {
    deal.comments = getDealComments(commentsEl);
  }

  const contentHtml = nRight?.getElementsByClassName("content");
  deal.content = contentHtml.item(0)?.innerHTML || "";

  return deal;
}

export function searchDealsDto(html: HTMLElement): OzbargainDeal[] {
  const deals: OzbargainDeal[] = [];

  const dds = html.getElementsByClassName("search-results").item(0);

  if (!dds) return deals;

  // Group DT and DD's together
  const dealsCount = dds.children.length / 2;
  let groupedDeals = [];
  let groupIndex = 0;
  for (let index = 0; index < dealsCount; index++) {
    groupedDeals.push([
      dds.children.item(groupIndex),
      dds.children.item(groupIndex + 1),
    ]);
    groupIndex += 2;
  }

  groupedDeals.forEach((groupedDeal) => {
    let deal: OzbargainDeal = { ...initDeal };
    deal.nid = getDealNid(groupedDeal[0]);
    deal = { ...deal, ...getVotes(groupedDeal[0]) };
    deal.title = getTitleForSearch(groupedDeal[0]);
    deal.content = getContentFromSearch(groupedDeal[1]);
    deal.imageUrl = getImageUrlFromSearch(groupedDeal[0]);
    deal.username = getSubmittingUserTitleFromSearch(groupedDeal[1]);
    deal.submittingDate = getSubmittingUserDateFromSearch(groupedDeal[1]);
    deal.commentCount = getCommentCountFromSearch(groupedDeal[1]);
    deal.expiredTag = getExpiredTag(groupedDeal[0]);

    deals.push(deal);
  });

  return deals;
}

export function dealsDto(
  dealsHtml: HTMLCollectionOf<Element>
): OzbargainDeal[] {
  const deals: OzbargainDeal[] = [];

  for (let index = 0; index < dealsHtml.length; index++) {
    let deal: OzbargainDeal = { ...initDeal };

    const dealHtml = dealsHtml.item(index);
    const nLeft = dealHtml?.children.item(0);
    const nRight = dealHtml?.children.item(1);

    deal.title = getTitle(nRight);
    deal = assignSharedDealData(deal, nLeft, nRight);

    // Content
    const contentHtml = nRight?.getElementsByClassName("content");
    if (contentHtml) {
      for (
        let contentIndex = 0;
        contentIndex < contentHtml.length;
        contentIndex++
      ) {
        const contentChildrenHtml = contentHtml[contentIndex].children;

        for (
          let contentChildrenIndex = 0;
          contentChildrenIndex < contentChildrenHtml.length;
          contentChildrenIndex++
        ) {
          const contentChild = contentChildrenHtml[contentChildrenIndex];

          if (contentChild.localName === "p") {
            deal.content = contentChild.textContent || "";
          }

          if (contentChild.className.includes("couponcode")) {
            deal.coupon = contentChild.textContent;
          }
        }
      }
    }

    deals.push(deal);
  }

  return deals;
}

function assignSharedDealData(
  deal: OzbargainDeal,
  nLeft: NLeft,
  nRight: NRight
) {
  deal.nid = getDealNid(nLeft);

  deal.submittingDate = getSubmittingUserDate(nRight);
  deal.dealDomain = getDealDomain(nRight);
  deal.imageUrl = getImageUrl(nRight);
  deal.expiredTag = getExpiredTag(nRight);
  deal = { ...deal, ...getLinks(nRight) };
  deal = { ...deal, ...getVotes(nLeft) };
  deal = { ...deal, ...getSubmittingContainerDeatils(nRight) };

  return deal;
}

function getDealNid(nLeft: NLeft): OzbargainDeal["nid"] {
  const titleHtml = nLeft?.getElementsByClassName("n-deal").item(0);
  const nid = titleHtml?.attributes.getNamedItem("data-nid");
  return nid?.value || "";
}

function getDealTags(footerEl: Element): OzbargainDeal["tags"] {
  let tags: OzbargainDeal["tags"] = [];

  const el = footerEl?.getElementsByClassName("taxonomy").item(0);

  if (!el) return tags;

  for (let index = 0; index < el.children.length; index++) {
    const tagSpan = el.children[index];
    const aHref = tagSpan.children.item(0);

    const url = aHref?.attributes.getNamedItem("href")?.value;
    const name = aHref?.textContent;

    if (name && url) {
      tags.push({ name, url });
    }
  }

  return tags;
}

function getDealComments(commentsEl: Element): OzbargainDeal["comments"] {
  const comments: OzbargainDeal["comments"] = [];

  for (let index = 0; index < commentsEl.children.length; index++) {
    const listEl = commentsEl.children[index];
    comments.push(getComment(listEl, 0));
  }

  return comments;
}

function getComment(commentEl: Element, level: number): Comment {
  const nextLevel = level + 1;
  const submittedEl = commentEl.getElementsByClassName(`submitted`).item(0);
  const cLink = submittedEl?.getElementsByClassName("c-link").item(0);

  const comment: Comment = {
    comments: [],
    content:
      commentEl.getElementsByClassName(`content`).item(0)?.textContent || "",
    date: cLink?.textContent || "",
    id: cLink?.attributes.getNamedItem("data-cid")?.value || "",
    username: "",
    userVoted: "none",
    recievedVotes: "",
    recievedVotesType: "none",
  };

  const receievedVotes = commentEl
    .getElementsByClassName(`cvc`)
    .item(0)?.textContent;

  if (receievedVotes) {
    comment.recievedVotes = receievedVotes;
    comment.recievedVotesType = receievedVotes[0] === "+" ? "pos" : "neg";
  }

  if (submittedEl) {
    for (let index = 0; index < submittedEl.children.length; index++) {
      const submittedChildEl = submittedEl.children[index];

      // username
      if (submittedChildEl.nodeName === "STRONG") {
        comment.username = submittedChildEl.children.item(0)?.textContent || "";
      } else if (submittedChildEl.classList.contains("voteup")) {
        comment.userVoted = "pos";
      } else if (submittedChildEl.classList.contains("votedown")) {
        comment.userVoted = "neg";
      }
    }
  }

  const nextLevelCommentEls = commentEl.getElementsByClassName(
    `comment level${nextLevel}`
  );

  for (let index = 0; index < nextLevelCommentEls.length; index++) {
    const nextLevelCommentEl = nextLevelCommentEls[index];
    comment.comments.push(getComment(nextLevelCommentEl, nextLevel));
  }

  return comment;
}

function getDealClicks(nRight: NLeft): OzbargainDeal["clicks"] {
  const el = nRight?.getElementsByClassName("nodeclicks").item(0);
  const value = el?.textContent || "";

  return value.replace("(", "").replace(" clicks)", "");
}

// Used for single deal page
function getTitleForDeal(doc: Document): string {
  const titleHtml = doc.getElementById("title");
  const title = titleHtml?.attributes.getNamedItem("data-title");
  return title?.value || "";
}

// used for list of deals
function getTitle(nRight: NRight): string {
  const titleHtml = nRight?.getElementsByClassName("title").item(0);
  const title = titleHtml?.attributes.getNamedItem("data-title");
  return title?.value || "";
}

// used for list of deals
function getTitleForSearch(html: NRight): string {
  const img = getImageEleFromSearch(html);
  if (!img) return "";
  return img?.attributes.getNamedItem("alt")?.value || "";
}

function getImageEleFromSearch(html: NRight): HTMLImageElement | null {
  const imageElements = html?.getElementsByTagName("img");
  if (!imageElements) return null;

  for (let index = 0; index < imageElements.length; index++) {
    const element = imageElements.item(index);
    const hasOzbImgRegex = element?.attributes
      .getNamedItem("src")
      ?.value.match(/https:\/\/files.ozbargain.com.au\/n/)?.length;
    if (hasOzbImgRegex && hasOzbImgRegex > 0) {
      // is ozbargain image element
      return element;
    }
  }

  return null;
}

function getImageUrlFromSearch(html: NRight): string {
  const img = getImageEleFromSearch(html);
  if (!img) return "";
  return img?.attributes.getNamedItem("src")?.value || "";
}

function getContentFromSearch(html: NRight): string {
  const body = html?.getElementsByTagName("p").item(0);
  if (!body) return "";
  return body.textContent || "";
}

function getCommentCountFromSearch(html: NRight): string {
  return (
    html?.getElementsByClassName("fa fa-comments-o").item(0)?.parentElement
      ?.textContent || ""
  );
}

function getSubmittingUserDateFromSearch(
  html: NRight
): OzbargainDeal["submittingDate"] {
  const lis = html?.getElementsByTagName("li");
  if (!lis) return null;

  // INDEX 2 is the date
  const element = lis?.item(2);
  if (!element?.textContent) return null;
  return matchDate(element?.textContent);
}

function getSubmittingUserTitleFromSearch(html: NRight): string {
  return html?.getElementsByTagName("a").item(0)?.textContent || "";
}

function getExpiredTag(nRight: NRight): string | null {
  const titleHtml = nRight?.getElementsByClassName("tagger expired").item(0);
  return titleHtml?.textContent || null;
}

type SubmittingContainer = Pick<
  OzbargainDeal,
  "associated" | "referrer" | "dealDomain" | "submittingDate" | "username"
>;

function getSubmittingContainerDeatils(nRight: NRight): SubmittingContainer {
  let result: SubmittingContainer = {};

  const container = getSubmittingConainter(nRight);

  if (!container) return result;

  result.submittingDate = matchDate(container.innerHTML);

  for (let index = 0; index < container.children.length; index++) {
    const el = container.children[index];

    if (el.children.item(0)?.className.includes("fa-link")) {
      result.dealDomain = el.children.item(1)?.textContent || "";
    } else if (el.textContent === "Referrer") {
      result.referrer = true;
    } else if (el.textContent === "Associated") {
      result.associated = true;
    } else if (
      // used by dealDto (not dealsDto)
      (el.children
        .item(0)
        ?.attributes?.getNamedItem("href")
        ?.value?.match(/\/user\/\w+/)?.length || 0) > 0
    ) {
      result.username = el.children.item(0)?.textContent || "";
    }
  }

  return result;
}

function getSubmittingUserDate(nRight: NRight): Date | null {
  const container = getSubmittingConainter(nRight);
  if (!container?.innerHTML) return null;
  return matchDate(container.innerHTML);
}

function getDealDomain(nRight: NRight): string | undefined {
  const container = getSubmittingConainter(nRight);
  return container?.children.item(1)?.textContent || undefined;
}

function getLinks(nRight: NRight): Ozbargainlink {
  const result: Ozbargainlink = {
    isFreebie: false,
    tags: [],
  };

  const linksContainer = getLinksContainer(nRight);
  const links = linksContainer?.children.item(0)?.children;
  if (!links) return result;

  for (let index = 0; index < links.length; index++) {
    const link = links[index].children.item(0);

    if (link && link.className.includes("fa-comment")) {
      result.commentCount = link.parentElement?.textContent?.trim() || "0";
    }

    if (link && link.className.includes("nodefreebie")) {
      result.isFreebie = true;
    }

    if (link && link.className.includes("tag")) {
      const tagAHref = link.children.item(1);
      const tagName = tagAHref?.textContent;
      const tagUrl = tagAHref?.attributes.getNamedItem("href")?.value;

      if (tagName && tagUrl) {
        result.tags.push({
          name: tagName,
          url: tagUrl,
        });
      }
    }

    if (link && link.className.includes("nodeexpiry")) {
      result.expiryDate = link.childNodes.item(1)?.textContent?.trim();
      result.expiryDateIn = link.children.item(1)?.textContent;
    }
  }

  return result;
}

function getImageUrl(nRight: NRight): OzbargainDeal["imageUrl"] {
  return nRight
    ?.getElementsByTagName("img")
    ?.item(0)
    ?.attributes.getNamedItem("src")?.value;
}

function getLinksContainer(nRight: NRight) {
  return nRight?.getElementsByClassName("links")?.item(0);
}

function getSubmittingConainter(nRight: NRight) {
  return nRight?.getElementsByClassName("submitted")?.item(0);
}
function getVotes(nLeft: NLeft): {
  votePositive: OzbargainDeal["votePositive"];
  voteNegative: OzbargainDeal["voteNegative"];
} {
  return {
    voteNegative:
      nLeft?.getElementsByClassName("votedown").item(0)?.textContent || "0",
    votePositive:
      nLeft?.getElementsByClassName("voteup").item(0)?.textContent || "0",
  };
}
