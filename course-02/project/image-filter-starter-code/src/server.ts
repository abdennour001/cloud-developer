import express, { Request, Response } from "express";
import bodyParser from "body-parser";
var validUrl = require("valid-url");
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
    // Init the Express application
    const app = express();

    // Set the network port
    const port = process.env.PORT || 8082;

    // Use the body parser middleware for post requests
    app.use(bodyParser.json());

    // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
    // GET /filteredimage?image_url={{URL}}
    // endpoint to filter an image from a public url.
    // IT SHOULD
    //    1
    //    1. validate the image_url query
    //    2. call filterImageFromURL(image_url) to filter the image
    //    3. send the resulting file in the response
    //    4. deletes any files on the server on finish of the response
    // QUERY PARAMATERS
    //    image_url: URL of a publicly accessible image
    // RETURNS
    //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

    app.get(
        "/filteredimage",
        async (req: Request, res: Response, next: Function) => {
            const { image_url } = req.query;

            // Check if the image_url exists.
            if (!image_url) {
                return res.status(400).send({ error: "image_url is required" });
            }

            // Check if the image_url is a valid url.
            if (!validUrl.isUri(image_url)) {
                return res
                    .status(400)
                    .send({ error: "image_url must be a valid url" });
            }

            // Call filterImageFromURL method.
            let filtred_image = await filterImageFromURL(image_url);

            // Send the resulting image to the user.
            res.status(200).sendFile(filtred_image, async err => {
                if (err) {
                    // proceed with error
                    next(err);
                } else {
                    // Log
                    console.log("[*] Sent file : ", filtred_image);

                    // Delete the resulting files in tmp folder.
                    console.log("[!] Deleteing file : ", filtred_image);
                    await deleteLocalFiles([filtred_image]);
                    console.log("[!] File deleted.");
                }
            });
        }
    );

    //! END @TODO1

    // Root Endpoint
    // Displays a simple message to the user
    app.get("/", async (req, res) => {
        res.send("try GET /filteredimage?image_url={{}}");
    });

    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
})();
