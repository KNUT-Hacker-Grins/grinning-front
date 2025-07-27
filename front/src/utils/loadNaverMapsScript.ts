// front/src/utils/loadNaverMapsScript.ts

interface NaverMapsWindow extends Window {
  naver?: any;
}

declare const window: NaverMapsWindow;

const NAVER_MAPS_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID;
const NAVER_MAPS_API_URL = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAPS_CLIENT_ID}&submodules=geocoder`;

let naverMapsScriptLoaded = false;
let naverMapsLoadPromise: Promise<void> | null = null;

export const loadNaverMapsScript = (): Promise<void> => {
  if (naverMapsScriptLoaded) {
    return Promise.resolve();
  }

  if (naverMapsLoadPromise) {
    return naverMapsLoadPromise;
  }

  naverMapsLoadPromise = new Promise((resolve, reject) => {
    if (!NAVER_MAPS_CLIENT_ID) {
      console.error("NAVER_MAPS_CLIENT_ID is not defined in environment variables.");
      reject(new Error("NAVER_MAPS_CLIENT_ID is not defined."));
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = NAVER_MAPS_API_URL;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      naverMapsScriptLoaded = true;
      resolve();
    };

    script.onerror = (error) => {
      console.error("Failed to load Naver Maps API script:", error);
      naverMapsLoadPromise = null; // Reset on error to allow retries
      reject(new Error("Failed to load Naver Maps API script."));
    };

    document.head.appendChild(script);
  });

  return naverMapsLoadPromise;
};
