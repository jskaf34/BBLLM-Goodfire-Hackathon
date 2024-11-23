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
conversational = {}


if __name__ == "__main__":

    with open(file_path, "r", encoding="utf-8") as file:
        for i, line in tqdm(enumerate(file)):
            conversation_data = json.loads(line)
            context = client.features.inspect(
                    conversation_data,
                    model=variant,
)
            conversational_features = context.top()._acts
            conversational[i] = {"conversational_features":[{"feature_label": act.feature.label, 
                                                                           "feature_index_sae": act.feature.index_in_sae,
                                                                            "activation": act.activation} for act in conversational_features],
                                                "sentence_features":[],
                                                "token_features":[]}
            tokens_features_list = []
            for token in context.tokens:
                if not ("<|" in token.__str__() and "|>" in token.__str__()) :
                    tokens_features_list.append({token._token: [{"feature_label": act.feature.label, 
                                            "feature_index_sae": act.feature.index_in_sae,
                                            "activation": act.activation} for act in token.inspect()._acts]})
            conversational[i]["token_features"] = tokens_features_list
            break

    with open("data/formatted_feature_data.json", "w", encoding="utf-8") as output_file:
        for conversation in conversational:
            output_file.write(json.dumps(conversational, ensure_ascii=False) + "\n")
    

            