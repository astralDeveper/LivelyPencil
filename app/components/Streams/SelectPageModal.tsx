import {
  Modal,
  ModalProps,
  Pressable,
  View,
  useWindowDimensions,
} from "react-native";
import { useAppDispatch, useAppSelector } from "shared/hooks/useRedux";
import { Button, Text } from "../ui";
import { setShowSelectPageModal } from "store/slices/stream/streamSlice";
import {
  SocketContext,
  SocketContextType,
} from "screens/Socket/SocketProvider";
import { useContext, useEffect, useState } from "react";
import { IConnectedUser, ILiveUser } from "shared/types/user/user.type";
import { HomeStackNavigatorProps } from "shared/navigators/HomeStackNavigator";
import { useNavigation } from "@react-navigation/native";
import { SelectedStream } from "shared/types/stream/streamList.type";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SelectPageModalProps extends ModalProps {
  onPressNavigate: (isLast: boolean) => void;
  title: string | undefined;
  closeModal?: () => void;
  selectedStream: SelectedStream;
}

const SelectPageModal = (props: SelectPageModalProps): JSX.Element => {
  const {navigate } = useNavigation<StreamStackNavigatorProps>();

  const { onPressNavigate, title, selectedStream,dataModal } = props;


  const { liveBookRooms } = useContext(SocketContext);
  const { liveBookSocket } = useContext(SocketContext) as SocketContextType;
  const navigation = useNavigation<HomeStackNavigatorProps>();
  const userId = useAppSelector((state) => state.auth.user?._id);

  // console.log("userId============>",userId)
  const [filteredData, setFilteredData] = useState<IStream[]>([]);

  useEffect(() => {
    const getDataFromAsyncStorage = async () => {
      try {
        const data = await AsyncStorage.getItem("flatlistData");
        if (data) {
          const parsedData: IStream[] = JSON.parse(data);
          // console.log("Raw data from AsyncStorage:", parsedData); // Log raw data

          setFilteredData(parsedData);
        } else {
          console.log("No data found in AsyncStorage.");
        }
      } catch (error) {
        console.error("Failed to retrieve data from AsyncStorage:", error);
      }
    };
  
    getDataFromAsyncStorage();
  }, []);
  

  const authorIds = filteredData.map(item => item.authorId === userId ? "true": "false")
 

  const isVisible = useAppSelector((state) => state.stream.showSelectPageModal);
  const { width, height } = useWindowDimensions();
  const dispatch = useAppDispatch();
  function handlePress(isLast: boolean) {
    if (isLast) onPressNavigate(true);
    else onPressNavigate(false);
    if (props.closeModal) props.closeModal();
    else dispatch(setShowSelectPageModal(false));
  }

  function closeModal() {
    if (props.closeModal) props.closeModal();
    else dispatch(setShowSelectPageModal(false));
  }
  const [forid,setForid]=useState()

const getItemIdFromStorage = async () => {
  try {
    // Retrieve item ID from AsyncStorage
    const itemId = await AsyncStorage.getItem('selectedItemId');
 
    

    if (itemId !== null) {
      // Item ID exists in AsyncStorage
      // console.log('Retrieved Item ID:', itemId);
      
      setForid(itemId); // Update state
    } else {
      // No item ID found
      console.log('No Item ID found in storage');
    }
  } catch (error) {
    console.error('Failed to retrieve item ID:', error);
  }
};

useEffect(() => {
  getItemIdFromStorage();
}, []);



  // console.log("HEllo",filteredData,userId); 
  // console.log("for id======>",) 

  function handleJoin() {
    // Check if userId is included in the authorIds array
    // if (filteredData.map(item => item.authorId === userId)) {
    //   navigate("Book Manage");
    //   closeModal();
    // } else {
      liveBookSocket.emit("join_live_book", {
        bookId: selectedStream.streamId,
        userId,
      });
  
      navigation.navigate("PageStack", {
        screen: "Preview",
        params: {
          shortCode: selectedStream.bookShortCode,
          coverImageUrl: selectedStream.coverImageUrl,
          id: selectedStream.streamId,
          title: selectedStream.title,
        },
      });
    // }
  }
  
 

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        {...props}
      >
        <Pressable
          style={{
            position: "absolute",
            width: isVisible || props.visible ? width : 0,
            height,
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
          onPress={closeModal}
        >
          <View
            style={{
              width: width * 0.85,
              maxWidth: 400,
              // maxHeight: height * 0.4,
              backgroundColor: "#fff",
              marginTop: height * 0.3,
              borderRadius: 20,
              alignSelf: "center",
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 20,
            }}
          >
            <Text className="text-Black font-Inter-bold text-lg">
              Which page you want to start viewing {title} from?
            </Text>
            {selectedStream?.streamId &&
            liveBookRooms.includes(selectedStream.streamId) ? (
              <>
                <Button
                  label="Watch Live"
                  className="bg-red border-white mt-2"
                  onPress={() => 
                    handleJoin()
                    

                  }
                />
                <Text className="text-Black text-center font-Inter-Black text-lg">
                  Or Published Pages
                </Text>
              </>
            ) : (
              <></>
            )}
            <Button
              label="First"
              // outlined
              onPress={() => handlePress(false)}
              className="mt-8 mb-4"
            />
            <Button label="Last" outlined onPress={() => handlePress(true)} />
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default SelectPageModal;
