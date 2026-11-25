/**
 * Vercel Serverless Function: прокси для динамического получения данных
 * категорий и свободных тарифов из модуля «Контур.Отель» (Frontdesk24 / Shelter Cloud).
 *
 * GET /api/kontur                     -> категории и характеристики (getHotelParams)
 * GET /api/kontur?arrival=YYYY-MM-DD&departure=YYYY-MM-DD&adults=2
 *                                     -> свободные домики и точные цены (getFreeRooms)
 */
const KONTUR_TOKEN = "25036D41-AC41-41C1-8010-C542D21DD847";
const PMS_BASE = "https://pms.frontdesk24.ru/api/online";

async function postJson(endpoint, body) {
  const res = await fetch(`${PMS_BASE}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`Frontdesk24 ${endpoint} responded with ${res.status}`);
  }
  return res.json();
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const { arrival, departure, adults } = req.query || {};

    if (arrival && departure) {
      const freeData = await postJson("getFreeRooms", {
        token: KONTUR_TOKEN,
        arrivalDate: arrival,
        departureDate: departure,
        adults: Math.max(1, parseInt(adults || "2", 10))
      });
      res.status(200).json({ ok: true, source: "pms.frontdesk24.ru/getFreeRooms", data: freeData });
      return;
    }

    const paramsData = await postJson("getHotelParams", {
      token: KONTUR_TOKEN
    });
    res.status(200).json({ ok: true, source: "pms.frontdesk24.ru/getHotelParams", data: paramsData });
  } catch (err) {
    res.status(502).json({
      ok: false,
      error: err instanceof Error ? err.message : "Kontur PMS request failed"
    });
  }
};
