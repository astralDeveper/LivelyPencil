import { useState } from "react";
import { RefreshControl, RefreshControlProps } from "react-native";

interface HandleRefreshProps extends Omit<RefreshControlProps, "refreshing"> {
  refetch: () => Promise<void>;
}

const HandleRefresh = (props: HandleRefreshProps) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);

  async function handleRefresh() {
    setRefreshing(true);
    await props.refetch();
    setRefreshing(false);
  }

  return (
    <RefreshControl
      {...props}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
};

export default HandleRefresh;
