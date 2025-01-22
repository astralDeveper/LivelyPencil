import { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  Alert,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { sendPushNotification } from "../../components/NotificationsManager";

import { RichEditor } from "react-native-pell-rich-editor";
import store from "store";
import { API_URL } from "@env";
import axios from "axios";
// $&
import CircularProgressButton from "../../components/CircularProgressButton";
import { CroppedImage } from "../../components/CroppedImage";
import clsx from "clsx";
import { SocketContext } from "../Socket/SocketProvider";
import UseDebounce from "../../components/UseDebounce";
import { decode } from "he";
// import { flags } from "store";

export default function RichTextEditor({ page, pageNumber }) {
  const { height } = useWindowDimensions();
  // const { setPickImgFlag } = flags();
  const { liveBookSocket } = useContext(SocketContext);
  const navigation = useNavigation();
  // const height = Dimensions.get("window").height;
  const richText = useRef();
  const scrollViewRef = useRef();
  const [loading, setLoading] = useState(false);
  const { currentUser } = store();

  // if Drafting page then select decoded text of draft, if new page then pagetext = ""
  const [pageText, setPageText] = useState(
    (page?.results?.length > 0 &&
      decode(page?.results[0].history.items[0].rawHtmlContent)) ||
      ""
  );
  let textLength = pageText.replace(/<[^>]*>?/gm, "").length;
  const imgCount = (pageText.match(/<img /g) || []).length;
  const newline = (pageText.match(/<\/div>/g) || []).length;

  //Content Limit
  const [percentage, setPercentage] = useState(0); // provide 1 less to have 100% otherwise it will be 101%
  const debouncedPageText = UseDebounce(pageText, 4000);

  // if there is square image then limit 150, for portrait limit 100, and for full limit 599
  let limit = pageText.includes(`class="square"`)
    ? 800
    : pageText.includes(`class="portrait"`)
    ? 800
    : pageText.includes(`class="full"`)
    ? 1
    : 1206;

  const handleAuthorAddedNewPage = () => {
    liveBookSocket.emit("author_added_new_page", {
      bookId: page.bookId,
      newPageNumber: pageNumber + 1, // PageNumber starts from 0
    });
  };
  const pickImage = (aspectRatio, size) => {
    // setPickImgFlag(true); //Appstate will stop while we pick image

    CroppedImage(
      aspectRatio,
      currentUser,
      pageText,
      setPageText,
      richText,
      size,
      liveBookSocket,
      page
      // setPickImgFlag // Appstate listen to it , if false then only work otherwise will not work
    );
  };
  async function sendNotify(title, body) {
    console.log(title, body);
    await sendPushNotification(title, body);
  }

  console.log(pageText);

  const richTextHandle = (text) => {
    const newText = text.replace(
      /<span style="color: gray;">Write Something...<\/span>/g,
      "<div></div>"
    );

    /* Why we using WrappedText: When Text copied from website it has first like outside the <div> and the remaining part was inside the div , so text outside div was looking awkward. having no margin and different fontSize.
  What wrappedText does is just put <div> tag to that untagged text */

    const wrappedText = newText.replace(
      /(^|<\/\w+>)([^<]+)(<|$)/g,
      (match, p1, p2, p3) => {
        return p1 + (p2.trim() ? `<div>${p2.trim()}</div>` : p2) + p3;
      }
    );
    // There was too much spacing after "ENTER" reason:[<br> was enclosed in <div></div>, making two spaces], we have to put <br> before </div> here i found solution if removeDivFrowmBr makes any problem then remove it an keep using wrappedText instead... change removeDivFromBr to

    let removeDivFromBr = wrappedText.replace(
      /<\/div><div><br><\/div>/g,
      "<br></div>"
    );

    // TakeOut img tag from div and place it outside, img tag inside div will cause having no margin . hence the text in that div will also be not having margin
    const extractImgFromDiv =
      imgCount == 0
        ? removeDivFromBr.replace(
            /<div>((?!<div>).*?)<img(.*?)>((?!<div>).*?)<\/div>/g,
            "<div>$1$3</div><img$2>"
          )
        : removeDivFromBr;

    const strippedText = extractImgFromDiv.replace(/<[^>]*>?/gm, "");
    setPageText(extractImgFromDiv);
    setPercentage(Math.round((strippedText.length / limit) * 100));
    // percentage < 101 && handleChange(); // not not update socket if limit has reached
  };

  const handleChange = () => {
    liveBookSocket.emit("page_updated", {
      bookId: page.bookId,
      authorId: currentUser.user.id,
      data: pageText,
    });
  };

  async function update(isDraft) {
    console.log("🐛🐛🐛 updating....🐛🐛🐛");

    await axios
      .request(`${API_URL}/pages/updatePage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.tokens.access.token}`,
        },
        data: {
          _id: page._id || page.results[0]._id, // because we are sending params also from the draftPages in BookPages. that respo doesn't have _id directly we need to nest it out.
          isDraft,
          rawHtmlContent: pageText,
        },
      })
      .catch((e) => console.log(e.message));
    // .then(() => handleAuthorAddedNewPage()); // I was using this on every update which is wrong. we should call it when we save page or leave
    // .finally(() => navigation.goBack());
  }

  async function updateContinue() {
    setLoading(true);
    // First we will update page
    await axios
      .request(`${API_URL}/pages/updatePage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.tokens.access.token}`,
        },
        data: {
          _id: page._id || page.results[0]._id,
          isDraft: "false",
          rawHtmlContent: pageText,
        },
      })
      .catch((e) => Alert.alert("Could not update the current page"));
    // console.log(pageText);
    // Now we create new page and continue to Create page
    await axios
      .request(`${API_URL}/pages/insertpage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.tokens.access.token}`,
        },
        data: {
          bookId: `${page.bookId}`, // got id from props from createPage
          items: [
            {
              type: "html",
              rawHtmlContent: "",
            },
          ],
        },
      })

      .then(({ data }) =>
        navigation.navigate("CreatePage", {
          page: data.page,
          draftPageId: data.page._id,
        })
      )
      .finally(() => {
        // We will notify viewers that we went to new page, then setPageText to null and execute handleChange to change their text too , and stop loading
        richText.current?.setContentHTML("");
        handleAuthorAddedNewPage();
        setPageText(""); // Send new emit of empty pageText
        handleChange();
        setLoading(false);
        scrollViewRef.current.scrollTo({ y: 0 }); // Scrolltop dont stay down.
      })
      .catch((e) =>
        Alert.alert(e.message, "Continuity failed due to server error")
      );
  }

  //Debounce Logic
  //Debounce Logic
  useEffect(() => {
    if (debouncedPageText) {
      update("true");
    }
  }, [debouncedPageText]);

  useEffect(() => {
    if (liveBookSocket) {
      liveBookSocket.on("new_viewer_joined", () => {
        //Note: When new Viewer joined the handleChange() will execute and he will see latest content.
        handleChange();
      });
    }

    return () => {
      if (liveBookSocket) {
        liveBookSocket.off("new_viewer_joined");
      }
    };
  }, [liveBookSocket, pageText]);

  useEffect(() => {
    return () => {
      setPageText("");
      //exp: Dont Send Emit after lefting RichText editor.client said he don't want viewer screen clean after author left
      // handleChange();
    };
  }, []);

  return (
    <View className="flex-1 bg-white ">
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
        <RichEditor
          // NOTE: if cursored moved to about 4 lines then scrollView move to that exact position.
          onCursorPosition={(pos) => {
            if (pos > 300) {
              scrollViewRef.current.scrollTo({ y: pos - 300 });
            }
          }}
          hideKeyboardAccessoryView={true}
          showsVerticalScrollIndicator={false}
          // styleWithCSS={true}
          editorStyle={{
            contentCSSText: "font-size:20px",
            color: percentage >= 100 ? "#FF9D9D" : "black",
            caretColor: "#6687c4",
          }}
          ref={richText}
          //Note: client said if pasted content has beyond limit then it shows up on viewer, i tested but it was fine. he was using same mobile phone
          // FIXME: This is a fix for that, uncomment onPaste
          // onPaste={()=>{
          //   if(percentage>=100){
          //     setPageText('')
          //     handleChange()
          //   }
          // }}
          // Send Emit of last changes
          onPaste={(val) => richText.current?.insertHTML(`<div></div>`)}
          onKeyUp={() => percentage < 101 && handleChange()}
          pasteAsPlainText={true}
          initialHeight={height * 0.86}
          initialContentHTML={pageText}
          onTouchStart={() => {
            // NOTE: this condition was creating new line when there was nothing inserted. So we only use it when there is no image
            if (imgCount > 0) {
              // richText.current?.setContentHTML(pageText + "<span><br/></span>"); NOTE: uncomment if recent problem regarding new text didn't work
              richText.current?.setContentHTML(pageText + "<div><br/></div>");
              richText.current?.focusContentEditor();
            }
          }}
          onChange={richTextHandle}
          placeholder="Lets write whats on your mind..."
          androidHardwareAccelerationDisabled={true}
        />
      </ScrollView>

      <View className="flex-row space-x-8 pt-1 px-1 h-10  bg-gray-300">
        {/* {percentage >= 100 && (
          <View className="absolute bg-gray-300 items-center p-5 w-screen z-50">
            <Text>You are exceeding the content limit.</Text>
          </View>
        )} */}

        {newline < 50 ? (
          <Pressable
            className="flex-row space-x-2 items-center"
            // Disabled if %>100 or Pure text length is equal to zero
            disabled={percentage > 100 || textLength === 0}
            onPress={() =>
              Alert.alert(
                "Confirm &  Save",
                "You cannot edit this page later, Are you sure to save this page.",
                [
                  // {
                  //   text: "Continue ",
                  //   onPress: () => {
                  //     handleAuthorAddedNewPage();
                  //     updateContinue();
                  //   },
                  // },

                  {
                    text: "CONFIRM & PUBLISH",
                    onPress: () => {
                      update("false");
                      handleAuthorAddedNewPage();
                      navigation.goBack();
                    },
                  },
                  {
                    text: "SAVE DRAFT",
                    onPress: () => {
                      update("true");
                      navigation.goBack();
                    },
                  },
                ],
                { cancelable: true }
              )
            }
          >
            <CircularProgressButton
              percentage={Math.round(percentage)}
              size={25}
              color={percentage >= 100 ? "#FF9D9D" : "#6687c4"}
            />
            <Text
              style={{ fontSize: 18 }}
              className={clsx("font-Inter-bold  self-center  text-black", {
                "text-black": percentage >= 100,
                "text-gray-400": percentage == 0,
              })}
            >
              PUBLISH
            </Text>
          </Pressable>
        ) : (
          <View className="bg-gray-300 items-center p-5 w-screen ">
            <Text className="text-xs font-Inter-medium">
              You are exceeding new lines limit
            </Text>
          </View>
        )}

        {imgCount < 1 && (
          <View className="flex-row space-x-2">
            {textLength < 800 && (
              <Pressable
                onPress={() => pickImage([1, 1], "square")}
                className="flex-row items-center space-x-2"
              >
                <View className=" border-2 border-gray-500 p-0.5 rounded-md">
                  <Ionicons name="image-outline" size={16} color="black" />
                </View>
                <Text className="font-Inter-Black text-xs">Square</Text>
              </Pressable>
            )}

            {textLength < 800 && (
              <Pressable
                onPress={() => pickImage([3, 4], "portrait")}
                className="flex-row items-center space-x-2 "
              >
                <View className=" border-2 border-gray-500 px-0.5 py-1 rounded-md">
                  <Ionicons name="image-outline" size={16} color="black" />
                </View>

                <Text className="font-Inter-Black text-xs">Portrait</Text>
              </Pressable>
            )}
            {textLength == 0 && (
              <Pressable
                onPress={() => pickImage([9, 16], "full")}
                className="flex-row items-center space-x-2"
              >
                <View className=" border-2 border-gray-500 px-0.5 py-2 rounded-md">
                  <Ionicons name="image-outline" size={16} color="black" />
                </View>
                <Text className="font-Inter-Black text-xs">Full</Text>
              </Pressable>
            )}
          </View>
        )}
        {/* If % less than 100 then show Continue, Text  length is > 299 or is has there is image inserted */}
        {/* All other icons SQUARE | PORTRAIT | FULL will be gone  */}
        {percentage < 100 &&
          (textLength > 800 || pageText.includes(`class="`)) && (
            <Pressable
              disabled={loading}
              onPress={() => updateContinue()}
              className="items-center self-center border-2 border-Primary/40 px-2 py-1 rounded-xl"
            >
              <Text>{loading ? "Loading..." : "Continue & Save"}</Text>
            </Pressable>
          )}
      </View>
    </View>
  );
}
