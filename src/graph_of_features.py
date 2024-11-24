import json
import time
from tqdm import tqdm
import os
import goodfire
from dotenv import load_dotenv
import networkx as nx
from itertools import combinations

load_dotenv()

file_path = "data/transformed_conversations.jsonl"
GOODFIRE_API_KEY = os.getenv('GOODFIRE_API_KEY')
client = goodfire.Client(
    GOODFIRE_API_KEY
  )
variant = goodfire.Variant("meta-llama/Meta-Llama-3-8B-Instruct")
conversational = {}
graph = nx.Graph()
THRESHOLD = 1.0
TIMEOUT = 4
MAX_RETRY = 3


if __name__ == "__main__":

    with open(file_path, "r", encoding="utf-8") as file:
        for i, line in tqdm(enumerate(file)):
            conversation_data = json.loads(line)
            if len(conversation_data) >20:
                print(f"Conversation {i} has more than 20 messages")
                continue
            retry = 0
            try: 
                while retry < MAX_RETRY:
                    try:
                        context = client.features.inspect(
                                conversation_data,
                                model=variant,
            )
                        conversational_features = context.top()._acts
                        conversational[i] = {"conversational_features":[{"feature_label": act.feature.label, 
                                                                        "feature_index_sae": act.feature.index_in_sae,
                                                                        "activation": act.activation} for act in conversational_features],
                                            "token_features":[]}
                        tokens_features_list = []
                        for token in tqdm(context.tokens):
                                if not ("<|" in token.__str__() and "|>" in token.__str__()) :
                                    tokens_features_list.append(
                                                                    [token._token, [
                                                                                    {
                                                                                        "feature_label": act.feature.label,
                                                                                        "feature_index_sae": act.feature.index_in_sae,
                                                                                        "activation": act.activation
                                                                                    } 
                                                                                    for act in token.inspect()._acts if act.activation > THRESHOLD]]
                                                                )
                                    # node_feature_ids = [act.feature.index_in_sae for act in token.inspect()._acts]
                                    node_feature_ids = [act.feature.index_in_sae for act in token.inspect()._acts if act.activation > THRESHOLD]
                                    feature_edges = [(u,v) for u, v in combinations(node_feature_ids, 2)]
                                    for edge in feature_edges:
                                        if graph.has_edge(edge[0], edge[1]):
                                            graph[edge[0]][edge[1]]["weight"]+=1
                                        else:
                                            graph.add_edge(edge[0],edge[1], weight=1)
                        conversational[i]["token_features"] = tokens_features_list
                        break
                    except Exception as e:
                        print(f"Exception or Error occured on conversation {i}")
                        print(f"Exception caught: {e}")
                        retry += 1
                        print(f"Retrying operation, retry number {retry}, waiting {TIMEOUT * retry}s")
                        time.sleep(TIMEOUT * retry)
            except KeyboardInterrupt :
                    print("KeyboardInterrupt detected! Breaking the loop and saving the graph.")
                    break
            

    with open("data/formatted_feature_data.json", "w", encoding="utf-8") as output_file:
        for conversation in conversational:
            output_file.write(json.dumps(conversational, ensure_ascii=False) + "\n")
    
    nx.write_weighted_edgelist(graph, "data/graph.weighted")