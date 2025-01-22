import { Dispatch, SetStateAction, useRef, useState } from "react";
import { INotification } from "shared/types/notification/notification.type";
import { PageList } from "shared/types/page/Page.type";
import { IStream } from "shared/types/stream/streamResponse.type";
import { IUser } from "shared/types/user/user.type";
import { formatPagesResponseToPagesList } from "shared/util/page";
import { number } from "yup";

export function usePaginatedPagesList(count: number) {
  const [pages, setPages] = useState<PageList[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onResultsReceived(data: unknown, notCascase?: boolean): number {
    const params = { count, pages, response: data.data.results };
    if (notCascase) {
      setPages([...formatPagesResponseToPagesList(params)]);
    } else {
      const newPages = [...pages, ...formatPagesResponseToPagesList(params)];
      setPages(newPages);
    }
    return params.count;
  }

  function incrementPageNumber() {
    setPageNumber(pageNumber + 1);
  }

  function resetPageNumber() {
    setPageNumber(1);
  }

  function resetResults() {
    setPages([]);
  }

  return {
    pages,
    onResultsReceived,
    pageNumber,
    incrementPageNumber,
    resetPageNumber,
    resetResults,
  };
}

export function usePaginatedStreamList() {
  const [streams, setStreams] = useState<IStream[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  let maxCount = useRef(0).current;

  function onResultsReceived(data: unknown, notCascase?: boolean) {
    if (
      typeof data === "object" &&
      data &&
      "data" in data &&
      typeof data.data === "object" &&
      data.data &&
      "results" in data.data &&
      Array.isArray(data.data.results)
    ) {
      if ("totalPages" in data && typeof data.totalPages === "number")
        maxCount = data.totalPages;
      else if (data.data.results.length === 0) {
        maxCount = pageNumber;
        return;
      }
      const newStreams: IStream[] = [...streams, ...data?.data?.results];
      if (notCascase) setStreams([...data?.data?.results]);
      else setStreams(newStreams);
    } else if (
      typeof data === "object" &&
      data &&
      "results" in data &&
      Array.isArray(data.results)
    ) {
      if (data.results.length === 0) {
        setStreams([]);
        maxCount = pageNumber;
        return;
      }
      const newStreams: IStream[] = [...streams, ...data.results];
      if (notCascase) setStreams([...data?.results]);
      else setStreams(newStreams);
    }
  }

  function incrementPageNumber() {
    if (maxCount > pageNumber) setPageNumber(pageNumber + 1);
  }

  function resetPageNumber() {
    setPageNumber(1);
  }

  function resetResults() {
    setStreams([]);
  }

  return {
    streams,
    onResultsReceived,
    pageNumber,
    incrementPageNumber,
    resetPageNumber,
    resetResults,
  };
}

export function usePaginatedUsersList() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onResultsReceived(data: unknown) {
    const newUsers: IUser[] = [...users, ...data?.data?.results];
    setUsers(newUsers);
  }

  function incrementPageNumber() {
    setPageNumber(pageNumber + 1);
  }

  function resetPageNumber() {
    if (pageNumber !== 1) {
      setPageNumber(1);
    }
  }

  function resetResults() {
    setUsers([]);
  }

  return {
    users,
    onResultsReceived,
    pageNumber,
    incrementPageNumber,
    resetPageNumber,
    resetResults,
  };
}

export function usePaginatedNotificationsList() {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [notifications, setNotifications] = useState<INotification[]>([]);

  function onResultsReceived(data: unknown) {
    if (
      data &&
      typeof data === "object" &&
      "notifications" in data &&
      Array.isArray(data.notifications)
    ) {
      setNotifications(data.notifications);
    }
  }

  function incrementPageNumber() {
    setPageNumber(pageNumber + 1);
  }

  function resetPageNumber() {
    if (pageNumber !== 1) {
      setPageNumber(1);
    }
  }

  function resetResults() {
    setNotifications([]);
  }

  return {
    notifications,
    onResultsReceived,
    pageNumber,
    incrementPageNumber,
    resetPageNumber,
    resetResults,
  };
}
