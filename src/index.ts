import express from "express";

import { ILicensePlate, MinisterCrawler, Status} from "./opposition/crawler";

const app = express();
const port =  process.env.PORT || 5000;

const crawler = new MinisterCrawler();

const parseLicenseFrom = (license: string): ILicensePlate => {
  const parts = license.replace('"', "").split("-");
  if (parts.length === 3 && !parts.some(((elm) => (elm == null || elm === ""))) ) {
    return {
      RegionKey1: parts[1],
      RegionKey2: parts[2],
      VehiculeID: parts[0],
    };
  }

  return null;
};

app.get("/api/v1/car/status", async (req, res) => {
  const licenseParam = req.query.license;
  const license = parseLicenseFrom(licenseParam);

  if (!license) {
    res.status(400);
    return res.json({
      error: "license plate format is incorrect",
    });
  }

  const result = await crawler.getVehiculeStatus(license);

  res.json({
    statusCode: result,
    statusName: (result === Status.Valide) ? "No opposition" : "Vehicule not found or with opposition",
    ts: + new Date(),
  });
});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
