
# BBLLM-Goodfire-Hackathon

## Introduction

BBLLM-Goodfire-Hackathon is a visualization tool designed to explore and analyze relationships between different features. Built using the GoodFire SDK, this tool provides a unique way to visualize the connections between features extracted via the SAE network. 

The SAE network leverages powerful large language models (LLMs) like LLAMA 8B and LLAMA 70B, providing an insightful perspective on feature interactions.

---

## Installation

### Backend and SDK Access

To extract features and access the GoodFire API, you need to set up the Python environment.

1. Install the required Python dependencies:
   ```shell
   pip install -r requirements.txt
   ```

2. Create a `.env` file in the root directory and add your GoodFire API key:
   ```
   GOODFIRE_API_KEY=<your-api-key>
   ```

---

### Frontend Setup

1. **Install Prerequisites**:
   - Ensure you have **Node.js (version 20)** and **Yarn** installed.

2. **Install Dependencies**:
   Navigate to the `src/app` directory and run:
   ```shell
   yarn install
   ```

3. **Run the Application**:
   Ensure Docker is installed, then run the following command to start the application:
   ```shell
   docker-compose -f docker-compose.prod.yml up --build
   ```

4. **Access the Application**:
   Open your browser and go to `http://localhost:8080`. The visualization tool will be ready for use.

---

## Usage

### Creating Data for Visualization

To generate data for the visualization tool, run the `graph_of_feature.py` script with your custom dataset as input. Ensure your input data follows this format:

```json
[
    {
        "role": "user",
        "content": "A + B means A is the mother of B\nA – B means A is the brother of B\nA @ B means A is the father of B\nA × means A is the sister of B.\nWhich of the following shows that P is the maternal uncle of Q?\n(a) Q – N + M × P (b) P + S × N – Q\n(c) P – M + N × Q (d) Q – S @ P"
    }
]
```

### Graph Data Output

The script will generate graph data in the form of a weighted edge list. Rename the output file to `graph.txt` and place it in the `public` folder of the web application for visualization.

---

## Contributions

We welcome contributions to improve and expand this project. If you'd like to contribute:
1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
