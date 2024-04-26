const express = require("express");
const { authenticate } = require("@pcd/zuauth");

const app = express();
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server listening on port ${port}`));

app.get("/", (_, res) => res.send("To use, please GET /verify?proof=<proof>"));

app.get("/verify", async (req, res) => {
  const { proof } = req.query;

  if (!proof || !(typeof proof === "string")) {
    console.error(`[ERROR] No proof specified`);
    return res
      .status(400)
      .json({ success: false, error: "No proof specified in query parameter" });
  }

  try {
    const {
      claim: { partialTicket, nullifierHash },
    } = await authenticate(proof, "", ETH_BERLIN_CONFIG);
    res.json({ success: true, userTicket: partialTicket, nullifierHash });
  } catch (e) {
    console.error(`[ERROR] ${e}`);
    res.status(500).json({
      success: false,
      error: e.message || "An unexpected error occurred",
    });
  }
});

const ETH_BERLIN_CONFIG = [
  {
    pcdType: "eddsa-ticket-pcd",
    publicKey: [
      "1ebfb986fbac5113f8e2c72286fe9362f8e7d211dbc68227a468d7b919e75003",
      "10ec38f11baacad5535525bbe8e343074a483c051aa1616266f3b1df3fb7d204",
    ],
    eventId: "53edb3e7-6733-41e0-a9be-488877c5c572",
    eventName: "ETHBerlin04",
    productId: "caa5cb88-19cc-4ee2-bf3d-6d379ce5e611",
    productName: "Team",
  },
  {
    pcdType: "eddsa-ticket-pcd",
    publicKey: [
      "1ebfb986fbac5113f8e2c72286fe9362f8e7d211dbc68227a468d7b919e75003",
      "10ec38f11baacad5535525bbe8e343074a483c051aa1616266f3b1df3fb7d204",
    ],
    eventId: "53edb3e7-6733-41e0-a9be-488877c5c572",
    eventName: "ETHBerlin04",
    productId: "e6a44839-76f5-4a47-8b3b-bb95ea6fc3cc",
    productName: "Hacker",
  },
  {
    pcdType: "eddsa-ticket-pcd",
    publicKey: [
      "1ebfb986fbac5113f8e2c72286fe9362f8e7d211dbc68227a468d7b919e75003",
      "10ec38f11baacad5535525bbe8e343074a483c051aa1616266f3b1df3fb7d204",
    ],
    eventId: "53edb3e7-6733-41e0-a9be-488877c5c572",
    eventName: "ETHBerlin04",
    productId: "a28bfaa9-2843-48b9-9200-f12dae4a483f",
    productName: "Mentor",
  },
  {
    pcdType: "eddsa-ticket-pcd",
    publicKey: [
      "1ebfb986fbac5113f8e2c72286fe9362f8e7d211dbc68227a468d7b919e75003",
      "10ec38f11baacad5535525bbe8e343074a483c051aa1616266f3b1df3fb7d204",
    ],
    eventId: "53edb3e7-6733-41e0-a9be-488877c5c572",
    eventName: "ETHBerlin04",
    productId: "beb248b4-9ef8-422f-b475-e94234721dc1",
    productName: "Reviewer",
  },
];
