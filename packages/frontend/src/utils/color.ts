enum ColorList {
  red = 'red',
  pink = 'pink',
  purple = 'purple',
  deepPurple = 'deep-purple',
  indigo = 'indigo',
  blue = 'blue',
  lightBlue = 'light-blue',
  cyan = 'cyan',
  teal = 'teal',
  green = 'green',
  lightGreen = 'light-green',
  lime = 'lime',
  yellow = 'yellow',
  amber = 'amber',
  orange = 'orange',
  deepOrange = 'deep-orange',
  brown = 'brown',
  grey = 'grey',
  blueGrey = 'blue-grey',
}

const TEXT_COLOR_MAPPING: Record<ColorList, string> = {
  [ColorList.red]: 'white',
  [ColorList.pink]: 'white',
  [ColorList.purple]: 'white',
  [ColorList.deepPurple]: 'white',
  [ColorList.indigo]: 'white',
  [ColorList.blue]: 'white',
  [ColorList.lightBlue]: 'black',
  [ColorList.cyan]: 'black',
  [ColorList.teal]: 'white',
  [ColorList.green]: 'black',
  [ColorList.lightGreen]: 'black',
  [ColorList.lime]: 'black',
  [ColorList.yellow]: 'black',
  [ColorList.amber]: 'black',
  [ColorList.orange]: 'black',
  [ColorList.deepOrange]: 'white',
  [ColorList.brown]: 'white',
  [ColorList.grey]: 'black',
  [ColorList.blueGrey]: 'white',
};

export const generateColorFromVersion = (version: string): { color: string; textColor: string } => {
  let hash = 0;
  for (let i = 0; i < version.length; i++) {
    hash = version.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorKeys = Object.keys(ColorList);
  const colorIndex = Math.abs(hash) % colorKeys.length;
  const color = ColorList[colorKeys[colorIndex] as keyof typeof ColorList];
  const textColor = TEXT_COLOR_MAPPING[color];
  return { color, textColor };
};
