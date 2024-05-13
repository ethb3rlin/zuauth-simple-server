const express = require("express");
const  {
  ZKEdDSAEventTicketPCD,
  ZKEdDSAEventTicketPCDPackage,
} = require("@pcd/zk-eddsa-event-ticket-pcd");
const { isEqualEdDSAPublicKey } = require("@pcd/eddsa-pcd");

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

app.listen(port, () => console.log(`Server listening on port ${port}`));

app.post("/", async (req, res) => {
  const proof = req.body;

  if (!proof) {
    console.error(`[ERROR] No proof specified`);
    return res
      .status(400)
      .json({ success: false, error: "No proof specified in POST body" });
  }

  console.log(`[INFO] Received proof: ${JSON.stringify(proof)}`);

  try {
    const pcd = await authenticate(proof);
    res.json({ success: true });
  } catch (e) {
    console.error(`[ERROR] ${e}`);
    res.status(500).json({
      success: false,
      error: e.message || "An unexpected error occurred",
    });
  }
});

async function authenticate(pcdData) {
  const { id, claim, proof } = pcdData;
  if (!id || !claim || !proof) {
    throw new Error("PCD data is incomplete");
  }

  const pcd = new ZKEdDSAEventTicketPCD(id, claim, proof);

  if (!(await ZKEdDSAEventTicketPCDPackage.verify(pcd))) {
    throw new Error("ZK ticket PCD is not valid");
  }

  const publicKeys = ETH_BERLIN_CONFIG.map((em) => em.publicKey);

  if (
    publicKeys.length > 0 &&
    !publicKeys.find((pubKey) =>
      isEqualEdDSAPublicKey(pubKey, claim.signer)
    )
  ) {
    throw new Error(
      "Signing key does not match any of the configured public keys"
    );
  }

  const productIds = new Set(ETH_BERLIN_CONFIG.map((em) => em.productId));

  if (
    productIds.size > 0 &&
    pcd.claim.partialTicket.productId &&
    !productIds.has(pcd.claim.partialTicket.productId)
  ) {
    throw new Error(
      "Product ID does not match any of the configured product IDs"
    );
  }

  return pcd;
}

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
