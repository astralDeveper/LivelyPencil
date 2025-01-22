import { PageList } from "shared/types/page/Page.type";
import { imageUrl } from "./htmlParsers";
import { Dispatch, SetStateAction } from "react";

export function formatPagesResponseToPagesList(params: {
  response: unknown;
  count: number;
}): PageList[] {
  const { response } = params;
  const newPages: PageList[] = [];
  if (Array.isArray(response)) {
    response.forEach((item: unknown) => {
      params.count++;
      if (
        item &&
        typeof item === "object" &&
        "isEnabled" in item &&
        "history" in item &&
        "_id" in item &&
        typeof item._id === "string" &&
        "indexOfPage" in item &&
        typeof item.indexOfPage === "number"
      ) {
        const { isEnabled, _id } = item;
        if (
          typeof item.history === "object" &&
          item.history &&
          "items" in item.history &&
          Array.isArray(item.history.items)
        ) {
          const firstItem = item.history.items[0];
          if (
            firstItem &&
            typeof firstItem === "object" &&
            "rawHtmlContent" in firstItem &&
            typeof firstItem.rawHtmlContent === "string"
          ) {
            const rawHtmlContent = firstItem.rawHtmlContent;
            if (typeof isEnabled === "boolean" && isEnabled) {
              newPages.push({
                html: rawHtmlContent,
                imageUrl: imageUrl(rawHtmlContent),
                id: _id || "",
                isEnabled: isEnabled,
                index: params.count,
                indexOfPage: item.indexOfPage,
              });
            }
          }
        } else if (Array.isArray(item.history)) {
          const firstIteminHistory = item.history[0];
          if (
            firstIteminHistory &&
            "items" in firstIteminHistory &&
            Array.isArray(firstIteminHistory.items)
          ) {
            const firstItemInItems = item.history[0].items[0];
            if (
              firstItemInItems &&
              typeof firstItemInItems === "object" &&
              "rawHtmlContent" in firstItemInItems &&
              typeof firstItemInItems.rawHtmlContent === "string"
            ) {
              const rawHtmlContent = firstItemInItems.rawHtmlContent;
              if (typeof isEnabled === "boolean" && isEnabled) {
                newPages.push({
                  html: rawHtmlContent,
                  imageUrl: imageUrl(rawHtmlContent),
                  id: _id || "",
                  isEnabled: isEnabled,
                  index: params.count,
                  indexOfPage: item.indexOfPage,
                });
              }
            }
          }
        }
      }
    });
  }

  return newPages;
}
