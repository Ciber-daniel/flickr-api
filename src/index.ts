import { resolve } from "path";
import { config } from "dotenv";
import express from "express";
import axios from "axios";
import { log } from "console";
import * as xml2js from "xml2js";
import cors from "cors";
// interfaces
import { Parameter } from "./interfaces/parameters.inteface";
import { Entry } from "./interfaces/entry.interface";

config({ path: resolve(__dirname, "../.env") });
const app = express();

app.use(cors());
app.use(express.json());

// define a route handler for the default home page
app.post("/api/search/flicker", async (req, res) => {
  // validate if the token is in the header
  if (!req.headers.authorization) {
    return res.status(401).send("Forbidden");
  }

  const data: Parameter = req.body;
  const token = process.env.TOKEN || "MVJDQJQqjAzoA3R0idrcfqf4tK1ZCyGr";
  const flickrApi =
    process.env.FLICKR_API ||
    "https://www.flickr.com/services/feeds/photos_public.gne";
  const apiKey = process.env.API_KEY || "dcc71b7ab14be2a0b8ea5945188b8eda";

  const headerToken = req.headers.authorization.replace("Bearer ", "");
  // validate if header token is valid
  if (headerToken !== token) {
    return res.status(401).send("Forbidden");
  }

  // validate if have body and tag
  if (!data || !data.tag) {
    log("bad request");
    return res.status(404).send("Bad request");
  }

  try {
    const url = flickrApi + `?tags=${data.tag}`;
    const response = await axios.get(url, {
      headers: {
        api_key: apiKey,
      },
    });

    // parse the xml string to an object and return array entry
    xml2js.parseString(response.data, (err: any, result: any) => {
      const resu: Entry[] = result.feed.entry;
      if (err) {
        log("error", err);
      }
      return res.send(JSON.stringify(resu));
    });
  } catch (error) {
    return res.end({ error });
  }
});

// start the Express server
app.listen(process.env.PORT || 8080, () => {
  log(`server started at http://localhost:${process.env.PORT}`);
});
