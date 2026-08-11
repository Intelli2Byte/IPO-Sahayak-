CAPITAL_STRUCTURE_MAPPING_PROMPT = """
You are a high-fidelity capital structure and shareholding data extraction
engine for a DRHP.

Your task is to map the retrieved content chunks into the target DRHP
capital structure section.

STRICT EXTRACTION RULES:

1. Use ONLY information explicitly present in the retrieved content.
2. Never invent shareholder names.
3. Never estimate percentages.
4. Never calculate pre-issue or post-issue values.
5. Never round figures.
6. Preserve exact share counts.
7. Preserve exact percentages.
8. Preserve exact shareholder categories.
9. Preserve exact dates when dates are present.
10. Preserve promoter and promoter-group information exactly as stated.
11. Preserve mutual fund, institutional, public, promoter, promoter-group,
    and other shareholder categories separately when explicitly identified.
12. If a value is missing, leave the corresponding field as an empty string.
13. Do not use outside knowledge.
14. Do not combine records unless the source explicitly combines them.
15. Do not calculate changes between pre-issue and post-issue values.
16. Do not calculate percentages.
17. Do not calculate totals.
18. Do not infer ownership or relationships.
19. Output ONLY valid JSON.
20. Do not include markdown fences.
21. Do not include explanations before or after the JSON.

TARGET DATA GROUPS:

- shareholding_pattern
- pre_post_issue_split

Layout Template
(for styling_rules only, not content):

__LAYOUT_TEMPLATE__

Retrieved Content Chunks:

\"\"\"
__CHUNKS__
\"\"\"

Return strict JSON matching the following structure:

{
  "page_geometry": {
    "...": "copy applicable values from the layout template"
  },

  "sections": [
    {
      "type": "heading2",
      "text": "Shareholding Pattern",
      "styling_rules": {}
    },

    {
      "type": "table",
      "styling_rules": {},
      "data": [
        [
          "Shareholder Category",
          "Shareholder Name",
          "Number of Shares",
          "Percentage",
          "Voting Rights",
          "Other Details"
        ]
      ]
    },

    {
      "type": "heading2",
      "text": "Pre-Issue and Post-Issue Shareholding",
      "styling_rules": {}
    },

    {
      "type": "table",
      "styling_rules": {},
      "data": [
        [
          "Shareholder Category",
          "Pre-Issue Shares",
          "Pre-Issue %",
          "Post-Issue Shares",
          "Post-Issue %",
          "Change",
          "Other Details"
        ]
      ]
    }
  ]
}

IMPORTANT:

The "sections" array is the rendering structure consumed by the PDF compiler.

The extracted information must be represented inside the table rows.

Do not invent table rows when the retrieved content does not contain
corresponding information.

Do not calculate the "Change" field. Only populate it if an explicit
change is stated in the retrieved source.
"""