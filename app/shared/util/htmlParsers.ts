import he from "he";

export function isImage(str: string): boolean {
  const regex = /&lt;img [^>]*>/g;
  const matches = str.match(regex);
  if (matches) return true;
  else return false;
}

export function imageOnly(str: string): string {
  const regex = /<img [^>]*>/g;
  const matches = str.match(regex);
  if (!matches) {
    return str;
  }

  const imgTag = matches[0];
  const imgTagWithoutStyle = imgTag.replace(/style="[^"]*"/, ""); // Remove style attribute

  return imgTagWithoutStyle;
}

export function imageUrl(str: string): string | null {
  const decodedStr = decodeHtmlEntities(str);
  const regex = /<img.*?src="(.*?)"/;
  const matches = regex.exec(decodedStr);
  if (matches && matches.length > 1) {
    return matches[1];
  } else {
    return null;
  }
}

export function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&");
}

export function parseStringByDiv(inputString: string): string[] {
  const decodedString = he.decode(inputString);
  const sections = decodedString.split(/<div>/);
  const linesArray = [];
  for (let i = 0; i < sections.length; i++) {
    const cleanedText = he
      .decode(sections[i])
      .replace(/<\/?[^>]+(>|$)/g, "")
      .trim();
    if (cleanedText.length > 0) {
      linesArray.push(cleanedText);
    }
  }

  return linesArray;
}

export function removeImageTag(input: string): string {
  const imageRegex = /<img[^>]+>/g;
  const result = input.replace(imageRegex, "");
  const trimmedResult = result.replace(/^<br>/, "");
  const finalResult = trimmedResult.replace(/<br>$/, "");
  return finalResult;
}
