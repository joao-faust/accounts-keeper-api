import { addDataToCache, getDataFromCache } from "./cache.js";

export async function addJwtToBlacklist(accessToken) {
  const jwtBlacklist = await getDataFromCache("jwtBlacklist");
  let data;

  if (!jwtBlacklist) {
    data = []
  }
  else {
    data = Array.from(JSON.parse(jwtBlacklist));
  }
  data.push(accessToken);

  await addDataToCache(
    "jwtBlacklist",
    JSON.stringify(data),
    parseInt(process.env.JWT_EXPIRES_IN)
  );
}

export async function isJwtInBlacklist(accessToken) {
  const jwtBlacklist = await getDataFromCache("jwtBlacklist");

  if (!jwtBlacklist) {
    return false;
  }

  const data = Array.from(JSON.parse(jwtBlacklist));

  if (data.indexOf(accessToken) === -1) {
    return false;
  }

  return true;
}
