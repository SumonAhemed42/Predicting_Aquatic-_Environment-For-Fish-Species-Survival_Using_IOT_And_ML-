# Predicting Aquatic Environment for Fish Species Survival Using IoT and ML

## Overview
This project introduces an intelligent system for aquaculture that combines **Internet of Things (IoT)** and **Machine Learning (ML)** to optimize water conditions for fish species survival. The system leverages sensors to monitor environmental parameters like pH, temperature, and turbidity, using a **Decision Tree Classifier** for accurate predictions. This innovative approach enhances fish farming efficiency, reduces mortality, and promotes sustainable aquaculture practices.

---

## Key Features
- **Real-Time Monitoring**: IoT sensors provide continuous updates on water quality.
- **Intelligent Predictions**: ML model predicts optimal conditions for fish species.
- **User-Friendly Interface**: Real-time dashboard for monitoring and input-based predictions.
- **Data Integration**: Combines IoT and ML for comprehensive aquaculture management.
- **Cost-Effective**: Uses affordable hardware and open-source technologies.

---

## System Components
### Hardware
- **Arduino Uno** with Ethernet Shield
- **Sensors**: pH, temperature, and turbidity
- LCD Display for live sensor readings

### Software
- **Backend**: FastAPI in Python for data processing and model integration.
- **Frontend**: Built with HTML, CSS, and JavaScript for real-time visualization.
- **Database**: MySQL on XAMPP for storing sensor data and predictions.

---

## Methodology
1. **Data Collection**:
   - Sourced dataset from Kaggle.
   - Real-time data from IoT sensors.
2. **Model Development**:
   - Compared multiple ML models (Decision Tree, KNN, Random Forest, SVM).
   - **Decision Tree Classifier** selected for superior accuracy (98% on balanced data).
3. **System Integration**:
   - IoT hardware sends sensor data to the backend via API.
   - Frontend visualizes predictions and real-time data.
4. **Evaluation**:
   - Balanced datasets improved model accuracy.
   - Metrics: Accuracy, Precision, Recall, F1-Score.

---

## Results
- **Accuracy**:
  - Balanced Dataset: 98% (Decision Tree).
  - Unbalanced Dataset: 82%.
- **Key Functionalities**:
  - Real-time fish species prediction based on sensor data.
  - Recommendations for optimal water parameters per species.
  - Live graphical updates of sensor values.

---

## Limitations and Future Scope
### Limitations:
- Sensor accuracy affected by environmental factors.
- Dependency on reliable network connectivity.

### Future Enhancements:
- Incorporate additional water quality metrics (e.g., dissolved oxygen).
- Enhance system scalability with cloud integration.
- Improve ML model for multi-species prediction.

---

## Cost Overview
| Component              | Cost (in units) |
|------------------------|-----------------|
| Arduino Uno           | 1050           |
| Ethernet Shield       | 1250           |
| pH Sensor             | 3299           |
| Turbidity Sensor      | 1400           |
| Temperature Sensor    | 185            |
| VPS Hosting (monthly) | 2000           |
| Domain (yearly)       | 600            |
| **Total**              | **10,784**     |

---

## Authors
- **Abdus Sabur** (1801034)
- **Sumon Ahemed** (1801042)

**Supervisor**: Suman Saha, Lecturer, Department of IoT and Robotics Engineering, BDU.

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.
