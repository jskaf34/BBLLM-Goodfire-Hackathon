import json
from tqdm import tqdm
file_path = "data/train.jsonl"

if __name__ == "__main__":
    data = []

    with open(file_path, "r", encoding="utf-8") as file:
        for line in tqdm(file):
            conversation_data = json.loads(line)
            conversation_list = []
        
            # Transform each conversation entry into the desired format
            for conversation in conversation_data.get("conversations", []):
                role = "user" if conversation["user"] == "human" else "assistant"
                conversation_list.append({
                    "role": role,
                    "content": conversation["text"]
                })
            
            # Add the conversation list to the overall data
            data.append(conversation_list)

    with open("data/transformed_conversations.jsonl", "w", encoding="utf-8") as output_file:
        for conversation in data:
            output_file.write(json.dumps(conversation, ensure_ascii=False) + "\n")
