import React, { useState } from "react";
import { View, Text, Image, TextInput, Modal, Pressable } from "react-native";
import { StyleSheet } from "react-native";

const AlertBox = ({
  title,
  body1,
  body2,
  body3,
  button1Text,
  button2Text,
  button3Text,
  optionalImage,
  optionalInput,
  onInputChange,
  visible,
  onClose,
}) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {optionalImage && (
            <Image
              source={optionalImage}
              style={styles.image}
              resizeMode="contain"
            />
          )}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body1}</Text>
          {body2 && <Text style={styles.body}>{body2}</Text>}
          {body3 && <Text style={styles.body}>{body3}</Text>}
          {optionalInput && (
            <TextInput
              style={styles.input}
              placeholder="Enter Text..."
              onChangeText={onInputChange}
              value={inputValue}
            />
          )}
          <View style={styles.buttonsContainer}>
            {button1Text && (
              <Pressable
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? "#0076FC" : "#fff",
                    borderWidth: 2,
                    borderColor: "#0076FC",
                    marginTop: 50,
                    borderRadius: 20,
                    paddingHorizontal: 40,
                    paddingVertical: 5,
                  },
                  styles.button,
                ]}
                onPress={onClose}
              >
                <Text>{button1Text}</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0076FC",
    marginBottom: 10,
  },
  body: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f5f5f5",
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  button: {
    alignItems: "center",
  },
});

export default AlertBox;
