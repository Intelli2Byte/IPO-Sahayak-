from pydantic import BaseModel

class FinancialRow(BaseModel):
    line_item: str
    values_by_year: dict[str, str]  # e.g. {"FY24": "1234.5", "FY23": "1100.2"}

class FinancialsSectionData(BaseModel):
    page_geometry: dict
    balance_sheet_rows: list[FinancialRow] = []
    pnl_rows: list[FinancialRow] = []
    cashflow_rows: list[FinancialRow] = []
    equity_changes_rows: list[FinancialRow] = []
