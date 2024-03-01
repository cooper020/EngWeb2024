import json
from collections import OrderedDict

def restructure_json(input_file):
    new_json_data = []
    
    with open(input_file, 'r') as f:
        for line in f:
            item = json.loads(line)
            item_id = item["_id"]["$oid"]  # Move o valor de "$oid" para o nível superior
            del item["_id"]  # Remove a chave "_id"
            new_item = {"filmes": OrderedDict([("id", item_id)] + list(item.items()))}
            new_json_data.append(new_item)
    
    output_file = input_file.split('.')[0] + '_fixed.json'

    with open(output_file, 'w') as f:
        json.dump(new_json_data, f, indent=4)
        
input_path = input("Digite o caminho do arquivo JSON que você deseja alterar: ")
restructure_json(input_path)
