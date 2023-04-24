import selfsigned from "selfsigned";
import fs from "fs";

const attributes = [{ name: "localhost", value: "localhost", type: "commonName" }];

selfsigned.generate(attributes, { days: 365 }, (err, pems) => {
    if (err) console.log(err);
    else {
        fs.writeFileSync("./certs/cert.pem", pems.cert);
        fs.writeFileSync("./certs/key.pem", pems.private);
    }
});
