import {
  GenericAxiosService,
  AXIOS_METHOD,
} from "@/services/GenericAxiosService";
import { ENDPOINT } from "@/enums/endpoints.enum";

export interface WaiverResponse {
  waiverGuid: string;
  s3FileLocation?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function uploadWaiverFile(
  token: string,
  fileUri: string,
  fileName: string,
  mimeType: string,
): Promise<WaiverResponse> {
  const formData = new FormData();
  formData.append("file", {
    uri: fileUri,
    name: fileName,
    type: mimeType || "application/pdf",
  } as any);

  return GenericAxiosService<WaiverResponse, FormData>({
    url: ENDPOINT.WAIVER_FILE,
    method: AXIOS_METHOD.POST,
    payload: formData,
    token,
  });
}
