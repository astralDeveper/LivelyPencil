import { useEffect } from "react";
import { useGetAllNotificationsQuery } from "shared/apis/notification/notificationApi";
import { usePaginatedNotificationsList } from "shared/hooks/usePaginatedList";
import { apiHandler } from "shared/util/handler";

const useNotification = () => {
  const { notifications, pageNumber, onResultsReceived, incrementPageNumber } =
    usePaginatedNotificationsList();
  const { data, isLoading, error } = useGetAllNotificationsQuery(pageNumber);

  useEffect(() => {
    apiHandler({
      data,
      error,
      onSuccess(response) {
        onResultsReceived(response);
      },
    });
  }, [data, error]);

  return {
    notifications,
    isLoading,
    incrementPageNumber,
  };
};

export default useNotification;
