import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image

class AlzheimerModel:
    def __init__(self, model_path="alzheimer_model.pth"):
        self.class_names = ["Mild Demented", "Moderate Demented", "Non Demented", "Very Mild Demented"]
        try:
            self.model = self._load_model(model_path)
            self.transform = transforms.Compose([
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
                transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
            ])
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            self.model = None
    
    def _load_model(self, model_path):
        model = models.resnet50(pretrained=False)
        model.fc = nn.Linear(model.fc.in_features, len(self.class_names))
        model.load_state_dict(torch.load(model_path, map_location=torch.device("cpu")))
        model.eval()
        return model
    
    def predict(self, image):
        """
        Predict the class of an image
        
        Args:
            image: PIL Image object
        
        Returns:
            str: Predicted class name or "Error" if model is not loaded
        """
        if self.model is None:
            return "Error"
            
        try:
            image = self.transform(image).unsqueeze(0)
            with torch.no_grad():
                outputs = self.model(image)
                _, predicted = torch.max(outputs, 1)
            return self.class_names[predicted.item()]
        except Exception as e:
            print(f"Error during prediction: {str(e)}")
            return "Error"
    
    def get_info_and_treatment(self, label):
        """
        Get information and treatment recommendations for a given label
        
        Args:
            label: str, the prediction label
        
        Returns:
            tuple: (information, treatment)
        """
        info = {
            "Non Demented": (
                "This stage shows no signs of dementia. However, regular check-ups are recommended.",
                "No treatment necessary, but a healthy lifestyle can help maintain cognitive health."
            ),
            "Very Mild Demented": (
                "Minor memory issues that may be attributed to aging but might also be early signs of Alzheimer's.",
                "Monitoring and cognitive exercises may help. Regular check-ups are recommended."
            ),
            "Mild Demented": (
                "Clear signs of cognitive decline, noticeable to family and friends, affecting daily life mildly.",
                "Medications like cholinesterase inhibitors may help. Cognitive therapy is also recommended."
            ),
            "Moderate Demented": (
                "Significant memory loss, confusion, and assistance required with daily activities.",
                "Combination of medications and supportive care, including memory aids and possibly full-time care."
            )
        }
        return info.get(label, ("Information not available", "Treatment options not available"))
