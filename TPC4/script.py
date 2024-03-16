import json

def obter_id_periodo(periodo, periodos):
    for key, value in periodos.items():
        if periodo == value["nome"]:
            return key
    return None

with open('compositores.json', 'r', encoding='utf-8') as file:
    dados_entrada = json.load(file)

periodos_unicos = set()
periodos = {}
for compositor in dados_entrada.get("compositores", []):
    periodo = compositor.get("periodo")
    if periodo:
        periodos_unicos.add(periodo)
for i, periodo_nome in enumerate(periodos_unicos, start=1):
    periodos[f"{i}"] = {"nome": periodo_nome, "id": str(i)}

saida = {"periodos": list(periodos.values()), "compositores": []}

compositores_por_periodo = {periodo_id: [] for periodo_id in periodos}
for compositor in dados_entrada.get("compositores", []):
    periodo = compositor.get("periodo")
    if periodo:
        periodo_id = obter_id_periodo(periodo, periodos)
        compositores_por_periodo[periodo_id].append(compositor)

for periodo_id, compositores_list in compositores_por_periodo.items():
    for compositor in compositores_list:
        compositor["periodo"] = periodo_id

saida["compositores"] = dados_entrada["compositores"]
with open('com_per.json', 'w', encoding='utf-8') as file:
    json.dump(saida, file, ensure_ascii=False, indent=4)
