export function isCategoryItem(item: unknown): item is {
  _id: string;
  categoryImage: string;
  categoryName: string;
  numberOfBooks: number;
  numberOfPages: number;
} {
  return (
    typeof item === "object" &&
    item !== null &&
    "_id" in item &&
    "categoryImage" in item &&
    "categoryName" in item &&
    "numberOfBooks" in item &&
    "numberOfPages" in item &&
    typeof item._id === "string" &&
    typeof item.categoryImage === "string" &&
    typeof item.categoryName === "string" &&
    typeof item.numberOfBooks === "number" &&
    typeof item.numberOfPages === "number"
  );
}
