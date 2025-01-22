// Button Show to viewers when it go live

import { Pressable, Text } from "react-native";
import Live from "./Live";

export default function LiveButton({ liveBookRooms, item, handleJoin }) {
  return (
    liveBookRooms.includes(item._id) && (
      <Pressable
        onPress={() => handleJoin(item)}
        className="z-50 absolute bottom-2   bg-red rounded-xl mx-2 w-[90%] py-0.5 "
      >
        <Text className="text-white text-sm` text-center font-Inter-bold ">
          <Live color={"white"} /> Live
        </Text>
        <Text className="text-white text-xs text-center font-Inter-bold">
          {item.title.length > 18
            ? item.title.slice(0, 18) + "..."
            : item.title}
        </Text>
      </Pressable>
    )
  );
}
