import json
from tqdm import tqdm
import os
import goodfire
from dotenv import load_dotenv
from itertools import combinations

load_dotenv()

file_path = "data/transformed_conversations.jsonl"
goodfire_api_key = os.getenv('GOODFIRE_API_KEY')
client = goodfire.Client(
    goodfire_api_key
  )
variant = goodfire.Variant("meta-llama/Meta-Llama-3-8B-Instruct")
conversational_feature_level = {}

if __name__ == "__main__":
    data = []

    with open(file_path, "r", encoding="utf-8") as file:
        for i, line in tqdm(enumerate(file)):
            conversation_data = json.loads(line)
            context = client.features.inspect(
                    conversation_data,
                    model=variant,
)
            conversational_features = context.top()._acts
            conversational_feature_level[i] = [{"feature_label": act.feature.label, "feature_index_sae": act.feature.index_in_sae, "activation": act.activation} for act in conversational_features]
            for token in context.tokens:
                if not ("<|" in token.__str__() and "|>" in token.__str__()) :
                    node_feature_ids = [act.feature.index_in_sae for act in token.inspect()._acts]
                    feature_edges = [(u,v) for u, v in combinations(node_feature_ids, 2)]
                    for edge in feature_edges:
                        if G.has_edge(edge[0], edge[1]):
                            G[edge[0]][edge[1]]["weight"]+=1
                        else:
                            G.add_edge(edge[0],edge[1], weight=1)
            break
    

            