# Private observation log (milestone 1)

On-device notes linked to **approved** Noo YouNiverse missions already in `public/log.html`.

This is a debug prototype. It is not a released product, not a medical record, and not shipped by the Cloudflare Worker (only `public/` is served).

## Run

```bash
npm test
npm run serve
```

Open `http://127.0.0.1:4173`. The UI starts with **zero** observations. JSON under `tests/fixtures/` is synthetic test data only.

## Rules baked into the store

- Mission IDs must exist in the extracted catalog (currently 01–11).
- Import rejects unknown missions and measurement/clinical keys (`heartRate`, `dose`, `diagnosis`, `sensorReadings`, …).
- Null results are valid.
- Uncertainty is a user label, not a computed scientific verdict.
