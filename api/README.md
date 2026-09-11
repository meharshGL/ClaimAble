# ClaimAble API

FastAPI bridge between the LangGraph pipeline (`graph/builder.py`) and the
Next.js portal (`../../claimable-portal`).

## Run it

From the project root (`ClaimAble-main/`):

```bash
pip install -r requirements.txt
uvicorn api.server:app --reload --port 8000
```

## Endpoints

| Method | Path                              | Purpose                                                   |
|--------|------------------------------------|------------------------------------------------------------|
| POST   | `/api/claims`                     | Upload documents, run `claim_graph.invoke(...)`, return the serialized result |
| GET    | `/api/claims`                     | List claims for the queue view                             |
| GET    | `/api/claims/{claim_id}`          | Full claim detail                                           |
| POST   | `/api/claims/{claim_id}/adjudicate` | Manual override — appends to `audit_log`, updates `claim_status` |

## Notes

- Claims are kept in-memory (`CLAIMS` dict in `server.py`). Swap in a real
  database once this needs to survive a restart or run behind more than one
  process.
- `serialize_state()` is the single place that turns the graph's raw
  `ClaimState` dict into the JSON the frontend contracts on. If you add
  fields to `ClaimState`, add them there too, and to
  `claimable-portal/lib/types.ts` on the frontend.
- Uploaded files are saved under `uploads/<claim_id>/` and their paths are
  what gets passed into `raw_documents` for the graph, exactly like
  `main.py` does today.