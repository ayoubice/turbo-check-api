import express from "express";

import { MinisterCrawler, Status, LicensePlate} from './opposition/crawler';

const app = express();
const port = 8080 || process.env.PORT;

const crawler = new MinisterCrawler();


const parseLicenseFrom = (license: string): LicensePlate => {
  const parts = license.replace('"','').split('-');
  if(parts.length === 3 && !parts.some((elm => (elm == null || elm === ''))) ) {
    return {
      VehiculeID: parts[0],
      RegionKey1: parts[1],
      RegionKey2: parts[2],
    }
  }

  return null;
}

app.get("/api/v1/car/status", async (req, res) => {
  const licenseParam = req.query['license'];
  console.log(licenseParam);
  const license = parseLicenseFrom(licenseParam);

  if(!license){
    res.status(400);
    return res.json({
      error: "license plate format is incorrect",
    });
  }

  const result = await crawler.getVehiculeStatus(license);
  
  res.json({
    statusCode: result,
    statusName: (result === Status.Valide)?'No opposition': 'Vehicule not found or with opposition',
    ts: + new Date(),
  });
});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
