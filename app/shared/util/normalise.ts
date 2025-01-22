import { Dimensions } from "react-native";

// Screen size in figma
const NORMAL_WIDTH = 390;
const NORMAL_HEIGHT = 844;

export const normalizeHeight = (value: number): number => {
  return (Dimensions.get("screen").height / NORMAL_HEIGHT) * value;
};

export const normalizeWidth = (value: number): number => {
  return (Dimensions.get("screen").width / NORMAL_WIDTH) * value;
};
