import os
import re

def convert_md_to_doc(md_path, doc_path):
    if not os.path.exists(md_path):
        return
    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read()

    html_body = content
    html_body = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html_body)
    html_body = re.sub(r'\*(.*?)\*', r'<em>\1</em>', html_body)

    lines = html_body.split("\n")
    processed_lines = []
    in_table = False
    table_html = []

    for line in lines:
        stripped = line.strip()
        if stripped.startswith("# "):
            processed_lines.append(f'<h1 style="color: #1a2e05; font-family: Calibri, Arial, sans-serif; font-size: 22pt; border-bottom: 2px solid #8cb34a; padding-bottom: 6px; margin-top: 24px;">{stripped[2:]}</h1>')
        elif stripped.startswith("## "):
            processed_lines.append(f'<h2 style="color: #2d3c13; font-family: Calibri, Arial, sans-serif; font-size: 16pt; margin-top: 20px; border-bottom: 1px solid #dcdcdc; padding-bottom: 4px;">{stripped[3:]}</h2>')
        elif stripped.startswith("### "):
            processed_lines.append(f'<h3 style="color: #43581e; font-family: Calibri, Arial, sans-serif; font-size: 13pt; margin-top: 16px;">{stripped[4:]}</h3>')
        elif stripped.startswith("* ") or stripped.startswith("- "):
            processed_lines.append(f'<li style="font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; margin-bottom: 4px;">{stripped[2:]}</li>')
        elif stripped.startswith("|"):
            if not in_table:
                in_table = True
                table_html = ['<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Calibri, Arial, sans-serif; font-size: 10pt; margin: 16px 0; border: 1px solid #cccccc;">']
            
            cells = [c.strip() for c in stripped.split("|")[1:-1]]
            if cells and not all(c == '' or set(c) == {'-'} or set(c) == {':'} or set(c) == {'-', ':'} for c in cells):
                if len(table_html) == 1:
                    table_html.append('<tr style="background-color: #1a230a; color: #ffffff; font-weight: bold;">')
                    for cell in cells:
                        table_html.append(f'<th style="padding: 10px; border: 1px solid #2d3c13; text-align: left; background-color: #1a230a; color: #ffffff;">{cell}</th>')
                    table_html.append('</tr>')
                else:
                    table_html.append('<tr>')
                    for cell in cells:
                        table_html.append(f'<td style="padding: 8px; border: 1px solid #dddddd;">{cell}</td>')
                    table_html.append('</tr>')
        else:
            if in_table:
                in_table = False
                table_html.append('</table>')
                processed_lines.append("".join(table_html))
                table_html = []
            if stripped:
                processed_lines.append(f'<p style="font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #222222; margin-bottom: 10px;">{stripped}</p>')

    if in_table:
        table_html.append('</table>')
        processed_lines.append("".join(table_html))

    full_doc_html = f"""<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>Airsoft Draws Compliance Document</title>
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
<w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml>
<![endif]-->
<style>
body {{ font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.6; color: #222222; margin: 40px; }}
h1 {{ color: #1a2e05; font-size: 22pt; border-bottom: 2px solid #8cb34a; padding-bottom: 6px; }}
h2 {{ color: #2d3c13; font-size: 16pt; border-bottom: 1px solid #dcdcdc; padding-bottom: 4px; margin-top: 20px; }}
h3 {{ color: #43581e; font-size: 13pt; margin-top: 16px; }}
table {{ border-collapse: collapse; width: 100%; margin: 16px 0; }}
th {{ background-color: #1a230a; color: #ffffff; padding: 10px; border: 1px solid #2d3c13; text-align: left; }}
td {{ padding: 8px; border: 1px solid #dddddd; }}
li {{ margin-bottom: 4px; }}
</style>
</head>
<body>
{"".join(processed_lines)}
</body>
</html>
"""

    with open(doc_path, "w", encoding="utf-8") as f:
        f.write(full_doc_html)
    print(f"Created: {doc_path}")

convert_md_to_doc("CLIENT_PLATFORM_UPDATE_REPORT.md", "CLIENT_PLATFORM_UPDATE_REPORT.doc")
convert_md_to_doc("UK_RIF_COMPLIANCE_MASTER_DOC.md", "UK_RIF_COMPLIANCE_MASTER_DOC.doc")
