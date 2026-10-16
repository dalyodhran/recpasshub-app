import {
  GenericAxiosService,
  AXIOS_METHOD,
} from "@/services/GenericAxiosService";
import { ENDPOINT } from "@/enums/endpoints.enum";

export interface LogoResponse {
  logoGuid: string;
  s3FileLocation?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getLogo(
  token: string,
  logoGuid: string,
): Promise<LogoResponse> {
  return GenericAxiosService<LogoResponse, void>({
    url: ENDPOINT.LOGO_BY_ID(logoGuid),
    method: AXIOS_METHOD.GET,
    token,
  });
}

export async function uploadLogoFile(
  token: string,
  fileUri: string,
  fileName: string,
  mimeType: string,
): Promise<LogoResponse> {
  const formData = new FormData();
  formData.append("file", {
    uri: fileUri,
    name: fileName,
    type: mimeType || "image/jpeg",
  } as any);

  return GenericAxiosService<LogoResponse, FormData>({
    url: ENDPOINT.LOGOS,
    method: AXIOS_METHOD.POST,
    payload: formData,
    token,
  });
}
