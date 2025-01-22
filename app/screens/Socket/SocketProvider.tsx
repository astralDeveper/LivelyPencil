import { ReactNode, createContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "shared/hooks/useRedux";
import { setLiveUsers } from "store/slices/socket/socketSlice";
import { useLazyGetLiveUsersRoomQuery } from "shared/apis/user/userApi";
import { DefaultEventsMap } from "@socket.io/component-emitter";

export type SocketContextType = {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
  liveBookSocket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
  connectedUsers: any[]; // Adjust this type according to your actual data structure
  updatedContent: string;
  setUpdatedContent: React.Dispatch<React.SetStateAction<string>>;
  liveBookRooms: any[]; // Adjust this type according to your actual data structure
  setLiveBookRooms: React.Dispatch<React.SetStateAction<any[]>>;
  newPage: any; // Adjust this type according to your actual data structure
  setNewPage: React.Dispatch<React.SetStateAction<any>>;
  viewers: any[]; // Adjust this type according to your actual data structure
  setViewers: React.Dispatch<React.SetStateAction<any[]>>;
  discussionSocket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
};

export const SocketContext = createContext<SocketContextType | undefined>(
  undefined
);

let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;
let liveBookSocket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;
let discussionSocket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;

const SocketComponent = ({ children }: { children: ReactNode }) => {
  const [liveBookRooms, setLiveBookRooms] = useState<string[]>([]);
  const [newPage, setNewPage] = useState<number | null>(null);
  const [viewers, setViewers] = useState<any>([]); // Adjust type
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [updatedContent, setUpdatedContent] = useState("<span></span>");
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const [getLiveRooms] = useLazyGetLiveUsersRoomQuery();

  useEffect(() => {
    if (token) {
      socket = io(process.env.EXPO_PUBLIC_SOCKET_URL, {
        auth: { token },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 1000,
        reconnectionAttempts: 100,
      });

      liveBookSocket = io(`${process.env.EXPO_PUBLIC_SOCKET_URL}/live-books`, {
        auth: {
          token,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 1000,
        reconnectionAttempts: 100,
      });

      discussionSocket = io(
        `${process.env.EXPO_PUBLIC_SOCKET_URL}/discussion`,
        {
          auth: {
            token,
          },
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 1000,
          reconnectionAttempts: 100,
        }
      );

      /**
       * Default Socket listeners
       */
      socket.on("connect", () => {
        // console.log("Connected to server");
        // displaySnackbar("Connected to server");
      });

      socket.on("connect_error", (error) => {
        // console.error("Connection Error", error);
        // displaySnackbar("Connection Error");
      });

      socket.on("reconnect_attempt", () => {
        // console.log("Reconnecting...");
        // displaySnackbar("Reconnecting...");
      });

      socket.on("reconnect", () => {
        // console.log("Reconnected to server");
        // displaySnackbar("Reconnected to server");
      });

      socket.on("reconnect_error", (error) => {
        // console.error("Reconnection Error", error);
        // displaySnackbar("Reconnection Error");
      });

      socket.on("reconnect_failed", () => {
        // console.error("Failed to reconnect");
        // displaySnackbar("Failed to reconnect");
      });

      socket.on("disconnect", (reason) => {
        // displaySnackbar("Disconnected from server");
      });

      socket.on("connected_users", (data) => {
        // if (Platform.OS === "android")
        // data.map((item) => console.log(item.email, Platform.OS));
        dispatch(setLiveUsers(data));
      });

      /**
       * Live Book Socket listeners
       */

      liveBookSocket.on("updated_live_books_rooms", (data) => {
        const liveRoomsList = data.map((elem) => elem[0]);
        setLiveBookRooms(liveRoomsList);
        getLiveRooms(undefined, false);
      });

      liveBookSocket.on("turn_off_book_live_mode", ({ roomName }) => {
        console.log("Viewers and Authors Broadcast message");
      });
      // We send viewers new page number here
      liveBookSocket.on("new_page_added", ({ newPageNumber }) => {
        console.log(" 🍎🍎🍎For Viewers new Page Updated", newPageNumber);
        setNewPage(newPageNumber);
      });

      // We can get any data regarding viewers who joined the room. e.g number of viewers etc
      liveBookSocket.on("live_book_updates", (data) => {
        setViewers(data);
      });
      /**
       * Replace this logic with Zustand so data from socket.io will be updated
       */
      liveBookSocket.on("author_updated_page", (data) => {
        // console.log("author updated page: ", data);
        setUpdatedContent(data);
      });
    }
    return () => {
      if (socket) {
        socket.close();
      }
      if (liveBookSocket) {
        liveBookSocket.close();
      }
    };
  }, []);

  // Notifications for live socketd

  // const notificationListener = useRef();
  // const responseListener = useRef();

  // useEffect(() => {
  //   notificationListener.current =
  //     Notifications.addNotificationReceivedListener((notification) => {
  //       // setNotification(notification);
  //     });

  //   // addNotificationResponseReceivedListener is for executing function after user click on notification
  //   responseListener.current =
  //     Notifications.addNotificationResponseReceivedListener((response) => {
  //       const { data } = response.notification.request.content;
  //       if (data) {
  //         // navigation.navigate("Notification");
  //       }
  //     });

  //   return () => {
  //     Notifications.removeNotificationSubscription(
  //       notificationListener.current
  //     );
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        liveBookSocket,
        connectedUsers,
        updatedContent,
        setUpdatedContent,
        liveBookRooms,
        setLiveBookRooms,
        newPage,
        setNewPage,
        viewers,
        setViewers,
        discussionSocket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default function SocketProvider({ children }: { children: ReactNode }) {
  return <SocketComponent>{children}</SocketComponent>;
}
