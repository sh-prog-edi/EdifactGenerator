"""
BDEW-AHB PDF-Extraktion - Grundgerüst

Zweck:
1. Prüfen, ob ein PDF einen nutzbaren Textlayer hat (siehe check_text_layer)
2. Tabellen seitenweise extrahieren und als JSON ablegen (siehe extract_tables)

Nutzung:
    python extract_pdf_tables.py check <pdf-datei>
    python extract_pdf_tables.py extract <pdf-datei> <start-seite> <end-seite> <ausgabe.json>

Voraussetzung:
    pip install pdfplumber --break-system-packages
"""

import sys
import json
import pdfplumber


def check_text_layer(pdf_path, sample_pages=15):
    """
    Prüft stichprobenartig, ob die PDF einen echten Textlayer hat oder OCR benötigt.
    Gibt pro geprüfter Seite die Anzahl extrahierter Zeichen aus.
    """
    with pdfplumber.open(pdf_path) as pdf:
        total_pages = len(pdf.pages)
        step = max(1, total_pages // sample_pages)
        print(f"PDF hat {total_pages} Seiten. Prüfe jede {step}. Seite ...\n")

        problematic = []
        for i in range(0, total_pages, step):
            page = pdf.pages[i]
            text = page.extract_text() or ""
            char_count = len(text.strip())
            status = "OK" if char_count > 20 else "VERDÄCHTIG (wenig/kein Text)"
            print(f"Seite {i + 1:>4}: {char_count:>5} Zeichen  -> {status}")
            if char_count <= 20:
                problematic.append(i + 1)

        print("\n--- Ergebnis ---")
        if not problematic:
            print("Alle Stichproben-Seiten haben einen nutzbaren Textlayer. OCR nicht nötig.")
        else:
            print(f"Folgende Seiten könnten OCR benötigen (bitte manuell prüfen): {problematic}")


def extract_tables(pdf_path, start_page, end_page, output_json):
    """
    Extrahiert Tabellen aus einem Seitenbereich und speichert sie strukturiert als JSON.
    Hinweis: pdfplumber erkennt Tabellen anhand von Linien/Ausrichtung - bei komplexen,
    mehrzeiligen AHB-Tabellen ggf. Ergebnis manuell nachbearbeiten oder auf ein
    multimodales KI-Modell (Seite als Bild) ausweichen.
    """
    results = []
    with pdfplumber.open(pdf_path) as pdf:
        for page_num in range(start_page - 1, min(end_page, len(pdf.pages))):
            page = pdf.pages[page_num]
            tables = page.extract_tables()
            for t_idx, table in enumerate(tables):
                results.append({
                    "seite": page_num + 1,
                    "tabelle_index": t_idx,
                    "zeilen": table
                })

    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"{len(results)} Tabelle(n) aus Seiten {start_page}-{end_page} extrahiert -> {output_json}")
    print("WICHTIG: Ergebnis stichprobenartig gegen das Original-PDF prüfen, bevor es in ahb-data/ übernommen wird.")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    command = sys.argv[1]

    if command == "check":
        check_text_layer(sys.argv[2])
    elif command == "extract":
        if len(sys.argv) != 6:
            print("Nutzung: python extract_pdf_tables.py extract <pdf> <start-seite> <end-seite> <ausgabe.json>")
            sys.exit(1)
        extract_tables(sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), sys.argv[5])
    else:
        print(f"Unbekannter Befehl: {command}")
        print(__doc__)
