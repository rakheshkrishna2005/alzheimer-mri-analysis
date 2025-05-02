from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
from typing import List
from pydantic import BaseModel
from alzheimer_model import AlzheimerModel

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model
model = AlzheimerModel()

class ScanResult(BaseModel):
    fileName: str
    prediction: str
    information: str
    treatment: str

@app.post("/api/analyze", response_model=List[ScanResult])
async def analyze_scans(files: List[UploadFile] = File(...)):
    results = []
    
    for file in files:
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Make prediction
        prediction = model.predict(image)
        
        # Get information and treatment
        information, treatment = model.get_info_and_treatment(prediction)
        
        # Add to results
        results.append(
            ScanResult(
                fileName=file.filename,
                prediction=prediction,
                information=information,
                treatment=treatment
            )
        )
    
    return results

@app.get("/")
def read_root():
    return {"message": "Alzheimer's Detection API is running"}
