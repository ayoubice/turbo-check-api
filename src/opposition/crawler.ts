import cheerio from "cheerio";
import request from "request-promise";

export enum Status {
  Valide = "1",
  Invalide_not_found = "0",
  Err = "-1",
}

export interface ILicensePlate {
  VehiculeID: string;
  RegionKey1: string;
  RegionKey2: string;
}

export interface ICrawler {
  getVehiculeStatus(licensePlate: ILicensePlate): Promise<Status>;
}

export class MinisterCrawler implements ICrawler {
  private URI = "http://www.assiaqacard.ma/opppub/";
  private OK_IMAGE_NAME = "images/Visuel_Etat-opposition_Non.png";
  private KO_IMAGE_NAME = "images/Visuel_Etat-opposition_Oui.png";
  private RESP_SELECTOR = ".ts-1-26 > img";

  private REGION_KEY_MAP = {
      A: "أ",
      B: "ب",
      D: "د",
      H: "ھ",
      O: "و",
    };

  public async getVehiculeStatus(licensePlate: ILicensePlate): Promise<Status> {
    const resp  = await this.send(licensePlate);

    return this.parseResponse(resp);
  }

  private parseResponse(resp: string): Status {
    if (resp === undefined) {
      return null;
    }

    if (resp === this.OK_IMAGE_NAME) {
      return Status.Valide;
    }

    if (resp === this.KO_IMAGE_NAME) {
      return Status.Invalide_not_found;
    }

    return Status.Invalide_not_found;
  }

  private send(plate: ILicensePlate): Promise<string> {
    const options = {
      form: {
        immat1: plate.VehiculeID,
        immat2: this.mapRegionKey(plate.RegionKey1),
        immat3: plate.RegionKey2,
        suivant:  null,
        type: "V",
      },
      transform: (body: string ) => {
        const $ = cheerio.load(body);

        return $(this.RESP_SELECTOR).attr("src");
      },
        url: this.URI ,
      };

    return request.post(options);
  }

  private mapRegionKey(key: string): string {
    if (this.REGION_KEY_MAP[key]) {
      return this.REGION_KEY_MAP[key];
    }

    return key;
  }

}
