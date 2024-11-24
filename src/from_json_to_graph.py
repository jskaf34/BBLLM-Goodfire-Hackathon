import json
import networkx as nx
from itertools import combinations
from tqdm import tqdm

# Constants
INPUT_FILE = "data/formatted_feature_data.json"  # Input JSON file
OUTPUT_GRAPH_FILE = "data/graph.weighted"         # Output graph file
OUTPUT_MAPPING_FILE = "data/index_label_mapping.json"  # Output mapping file
THRESHOLD = 1.0  # Minimum activation threshold

def load_jsonl_file(file_path):
    """Load the JSON file and return the data."""
    data = []
    with open(file_path, "r", encoding="utf-8") as f:
        for line in f:
            data.append(json.loads(line.strip()))
        data = list(data[0].values())
    return data

def create_graph_and_mapping(data):
    """Transform the JSON data into a weighted graph and create a mapping."""
    graph = nx.Graph()
    index_label_mapping = {}

    for conversation in tqdm(data):
        for token_features in conversation["token_features"]:
            token, features = token_features  # Token and its features

            # Ensure the data format is correct
            if not isinstance(features, list):
                print(f"Skipping invalid token feature: {token_features}")
                continue

            # Extract node feature IDs with activation above THRESHOLD
            node_feature_ids = []
            for feature in features:
                if feature["activation"] > THRESHOLD:
                    index_sae = feature["feature_index_sae"]
                    label = feature["feature_label"]

                    # Build the mapping
                    if index_sae not in index_label_mapping:
                        index_label_mapping[index_sae] = label

                    node_feature_ids.append(index_sae)

            # Add edges between all pairs of features (as a fully connected graph)
            feature_edges = combinations(node_feature_ids, 2)
            for edge in feature_edges:
                if graph.has_edge(edge[0], edge[1]):
                    graph[edge[0]][edge[1]]["weight"] += 1
                else:
                    graph.add_edge(edge[0], edge[1], weight=1)

    return graph, index_label_mapping

def main():
    print("Loading data from JSON...")
    data = load_jsonl_file(INPUT_FILE)

    print("Transforming data into a graph and creating mapping...")
    graph, index_label_mapping = create_graph_and_mapping(data)

    print(f"Saving the graph to {OUTPUT_GRAPH_FILE}...")
    nx.write_weighted_edgelist(graph, OUTPUT_GRAPH_FILE)

    print(f"Saving the index-label mapping to {OUTPUT_MAPPING_FILE}...")
    with open(OUTPUT_MAPPING_FILE, "w", encoding="utf-8") as f:
        json.dump(index_label_mapping, f, ensure_ascii=False, indent=4)

    print("Graph and mapping generation complete.")

if __name__ == "__main__":
    main()
