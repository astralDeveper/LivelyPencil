import HomeStackNavigator from "shared/navigators/HomeStackNavigator";
import SocketProvider from "./Socket/SocketProvider";

export default function HomeSocket() {
  return (
    <SocketProvider>
      <HomeStackNavigator />
    </SocketProvider>
  );
}
