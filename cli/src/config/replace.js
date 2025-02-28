export const changeAppName = (name, content) => {
  const jsonFile = JSON.parse(content);
  jsonFile.name = name;
  return JSON.stringify(jsonFile, null, 2);
};
