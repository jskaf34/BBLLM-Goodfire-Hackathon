from dotenv import load_dotenv
import os
import goodfire

load_dotenv()

goodfire_api_key = os.getenv('GOODFIRE_API_KEY')

if __name__ == '__main__':
    print(goodfire_api_key)

    client = goodfire.Client(
    goodfire_api_key
    )

    # Instantiate a model variant
    variant = goodfire.Variant("meta-llama/Meta-Llama-3-8B-Instruct")
    
    context = client.features.inspect(
    [
        {
            "role": "assistant",
            "content": "Hola!"
        },
    ],
        model=variant,
    )
    matrix = context.matrix()
    matrix
