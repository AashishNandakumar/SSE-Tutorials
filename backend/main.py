from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import json
import uvicorn
from asyncio import sleep

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def coordinates_generator():
    coordinates = open("backend/coordinates.json")
    coordinates = json.load(coordinates)

    for coordinate in coordinates:
        data = json.dumps(coordinate)
        yield f"event: locationUpdate\ndata: {data}\n\n"
        await sleep(1)


@app.get("/get-coordinates")
async def root():
    return StreamingResponse(coordinates_generator(), media_type="text/event-stream")


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
