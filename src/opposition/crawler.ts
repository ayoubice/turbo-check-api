const request = require('request-promise');
const cheerio = require('cheerio');

export enum Status {
  Valide = '1',
  Invalide_not_found = '0',
  Err = '-1',
}

export interface LicensePlate {
  VehiculeID: string,
  RegionKey1: string,
  RegionKey2: string,
}

export interface Crawler {
  getVehiculeStatus(licensePlate: LicensePlate): Promise<Status>
}

export class MinisterCrawler implements Crawler {
  private URI = 'http://www.assiaqacard.ma/opppub/';
  private OK_IMAGE_NAME = 'images/Visuel_Etat-opposition_Non.png';
  private KO_IMAGE_NAME = 'images/Visuel_Etat-opposition_Oui.png';
  private RESP_SELECTOR = '.ts-1-26 > img';

  private REGION_KEY_MAP = {
      'A':'أ',
      'B':'ب',
      'D':'د',
      'H':'ھ',
      'O':'و',
    }



  public async getVehiculeStatus(licensePlate: LicensePlate): Promise<Status> {
    const resp  = await this.send(licensePlate);

    return this.parseResponse(resp);
  }

  private parseResponse(resp: string): Status {
    if(resp === undefined) {
      return null;
    }

    if(resp == this.OK_IMAGE_NAME) {
      return Status.Valide;
    }

    if(resp == this.KO_IMAGE_NAME) {
      return Status.Invalide_not_found;
    }

    return Status.Invalide_not_found;
  }

  private send(plate: LicensePlate): Promise<string> {
    const options = {
      url:this.URI ,
      transform: (body: string ) => {
        const $ = cheerio.load(body);

        return $(this.RESP_SELECTOR).attr('src');
      },
      form: {
        immat1: plate.VehiculeID,
        immat2: this.mapRegionKey(plate.RegionKey1),
        immat3: plate.RegionKey2,
        type: 'V',
         suivant:  null,
      }
    }

    console.log(options);

    return request.post(options);
  }

  private mapRegionKey(key: string): string {
    if(this.REGION_KEY_MAP[key]){
      return this.REGION_KEY_MAP[key];
    }

    return key;
  }

}

