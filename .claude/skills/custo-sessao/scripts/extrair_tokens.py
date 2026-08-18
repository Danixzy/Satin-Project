#!/usr/bin/env python3
"""Extrai tokens de entrada/saída dos transcripts locais do Claude Code.

Fonte: ~/.claude/projects/<projeto>/<session-id>.jsonl, o mesmo caminho que
INSTRUCOES-TRABALHO.md seção 5 indica pra Claude Code.
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path


def dir_do_projeto(caminho):
    slug = re.sub(r"[^a-zA-Z0-9]", "-", str(Path(caminho).resolve()))
    return Path.home() / ".claude" / "projects" / slug


def sessoes(base):
    return sorted(base.glob("*.jsonl"), key=lambda p: p.stat().st_mtime)


def novo_acumulador():
    return {"chamadas": 0, "input": 0, "cache_creation": 0, "cache_read": 0, "output": 0}


def agrega(arquivos, desde=None, ate=None):
    dados = {
        "chamadas": 0,
        "sidechain": 0,
        "input": 0,
        "cache_creation": 0,
        "cache_read": 0,
        "output": 0,
        "modelos": set(),
        "por_modelo": {},
        "inicio": None,
        "fim": None,
    }
    vistos = set()

    for arquivo in arquivos:
        with open(arquivo, encoding="utf-8") as f:
            for linha in f:
                linha = linha.strip()
                if not linha:
                    continue
                try:
                    d = json.loads(linha)
                except json.JSONDecodeError:
                    continue
                if d.get("type") != "assistant":
                    continue

                msg = d.get("message") or {}
                uso = msg.get("usage")
                if not uso:
                    continue

                ts = d.get("timestamp")
                if desde and (not ts or ts < desde):
                    continue
                if ate and (not ts or ts > ate):
                    continue

                mid = msg.get("id")
                if mid:
                    if mid in vistos:
                        continue
                    vistos.add(mid)

                dados["chamadas"] += 1
                if d.get("isSidechain"):
                    dados["sidechain"] += 1
                dados["input"] += uso.get("input_tokens", 0)
                dados["cache_creation"] += uso.get("cache_creation_input_tokens", 0)
                dados["cache_read"] += uso.get("cache_read_input_tokens", 0)
                dados["output"] += uso.get("output_tokens", 0)

                modelo = msg.get("model")
                if modelo:
                    dados["modelos"].add(modelo)
                    acc = dados["por_modelo"].setdefault(modelo, novo_acumulador())
                    acc["chamadas"] += 1
                    acc["input"] += uso.get("input_tokens", 0)
                    acc["cache_creation"] += uso.get("cache_creation_input_tokens", 0)
                    acc["cache_read"] += uso.get("cache_read_input_tokens", 0)
                    acc["output"] += uso.get("output_tokens", 0)
                if ts:
                    if dados["inicio"] is None or ts < dados["inicio"]:
                        dados["inicio"] = ts
                    if dados["fim"] is None or ts > dados["fim"]:
                        dados["fim"] = ts

    return dados


def fmt(n):
    return f"{n:,}".replace(",", ".")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--projeto", default=os.getcwd(), help="raiz do projeto (padrão: diretório atual)")
    p.add_argument("--dir", help="caminho direto do diretório de transcripts, se a derivação automática falhar")
    p.add_argument("--sessao", help="id da sessão (nome do .jsonl sem extensão); padrão: a mais recente")
    p.add_argument("--todas", action="store_true", help="agrega todas as sessões do projeto")
    p.add_argument("--desde", help="só turnos com timestamp >= este valor (ISO 8601 UTC, ex: 2026-08-18T04:00:00Z)")
    p.add_argument("--ate", help="só turnos com timestamp <= este valor (ISO 8601 UTC)")
    p.add_argument("--listar", action="store_true", help="lista as sessões disponíveis e sai")
    p.add_argument("--preco-in", type=float, help="US$ por 1M tokens de entrada (tabela oficial do provedor)")
    p.add_argument("--preco-out", type=float, help="US$ por 1M tokens de saída")
    p.add_argument("--rotulo", default="", help="texto da coluna 'Chamada' na linha markdown")
    args = p.parse_args()

    base = Path(args.dir) if args.dir else dir_do_projeto(args.projeto)
    if not base.is_dir():
        sys.exit(f"Diretório de transcripts não encontrado: {base}\nPasse --dir com o caminho correto.")

    todas = sessoes(base)
    if not todas:
        sys.exit(f"Nenhum .jsonl em {base}")

    if args.listar:
        print(f"Sessões em {base}:\n")
        for s in todas:
            mtime = datetime.fromtimestamp(s.stat().st_mtime).strftime("%Y-%m-%d %H:%M")
            print(f"  {s.stem}  (modificado {mtime}, {s.stat().st_size // 1024} KB)")
        return

    if args.todas:
        alvos = todas
    elif args.sessao:
        alvos = [s for s in todas if s.stem == args.sessao]
        if not alvos:
            sys.exit(f"Sessão '{args.sessao}' não encontrada. Use --listar pra ver as disponíveis.")
    else:
        alvos = [todas[-1]]

    d = agrega(alvos, desde=args.desde, ate=args.ate)
    if d["chamadas"] == 0:
        sys.exit("Nenhum turno com dados de uso no filtro aplicado.")

    entrada_total = d["input"] + d["cache_creation"] + d["cache_read"]

    print("=" * 62)
    print("CONSUMO DE TOKENS")
    print("=" * 62)
    print(f"Sessões analisadas    : {', '.join(s.stem for s in alvos)}")
    print(f"Modelo(s)             : {', '.join(sorted(d['modelos'])) or '—'}")
    print(f"Período (UTC)         : {d['inicio']} → {d['fim']}")
    print(f"Chamadas de API       : {fmt(d['chamadas'])}" + (f"  (das quais {fmt(d['sidechain'])} de subagentes)" if d["sidechain"] else ""))
    print("-" * 62)
    print(f"Entrada — frescos     : {fmt(d['input'])}")
    print(f"Entrada — cache criado: {fmt(d['cache_creation'])}")
    print(f"Entrada — cache lido  : {fmt(d['cache_read'])}")
    print(f"ENTRADA TOTAL         : {fmt(entrada_total)}")
    print(f"SAÍDA TOTAL           : {fmt(d['output'])}")
    print("=" * 62)

    if len(d["por_modelo"]) > 1:
        print("\nQuebra por modelo (preços diferem — calcule o custo por modelo, não no agregado):")
        for modelo in sorted(d["por_modelo"]):
            m = d["por_modelo"][modelo]
            ent = m["input"] + m["cache_creation"] + m["cache_read"]
            print(f"  {modelo}")
            print(f"    chamadas={fmt(m['chamadas'])}  entrada={fmt(ent)} "
                  f"(frescos {fmt(m['input'])} / cache criado {fmt(m['cache_creation'])} / cache lido {fmt(m['cache_read'])})"
                  f"  saída={fmt(m['output'])}")

    if args.preco_in is not None and args.preco_out is not None:
        custo = entrada_total / 1_000_000 * args.preco_in + d["output"] / 1_000_000 * args.preco_out
        print(f"\nCusto pela fórmula do trabalho (preços informados: in ${args.preco_in}/1M, out ${args.preco_out}/1M):")
        print(f"  ({fmt(entrada_total)} / 1M) * {args.preco_in} + ({fmt(d['output'])} / 1M) * {args.preco_out} = US$ {custo:.2f}")
        print("\n  ATENÇÃO: isso trata todo token de entrada pelo mesmo preço. Cache de leitura")
        print("  custa uma fração do token novo, e cache de escrita custa mais — então esse")
        print("  número tende a NÃO bater com o /cost. Confira a tabela oficial do provedor e")
        print("  prefira o valor do /cost como evidência principal.")
    else:
        print("\nCusto: passe --preco-in e --preco-out (US$ por 1M tokens, da tabela oficial")
        print("do provedor) pra calcular pela fórmula do trabalho. Compare sempre com o /cost.")

    rotulo = args.rotulo or "_preencher_"
    modelo = ", ".join(sorted(d["modelos"])) or "_preencher_"
    print("\nLinha pra colar em SDD/log-chamadas.md:\n")
    print(f"| _n_ | {rotulo} | _branch_ | {modelo} | {fmt(entrada_total)} | {fmt(d['output'])} | _custo_ | ⬜ |")


if __name__ == "__main__":
    main()
