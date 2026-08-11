from pydantic import BaseModel, Field


class AuditFinding(BaseModel):
    finding: str
    description: str = ""
    status: str = ""
    remarks: str = ""


class AOC2Transaction(BaseModel):
    transaction_description: str
    related_party: str = ""
    relationship: str = ""
    transaction_amount: str = ""
    nature_of_transaction: str = ""
    duration: str = ""
    other_details: str = ""


class CSRActivity(BaseModel):
    activity: str
    location: str = ""
    amount_spent: str = ""
    beneficiaries: str = ""
    implementing_agency: str = ""
    other_details: str = ""


class LegalRegulatorySectionData(BaseModel):
    page_geometry: dict
    audit_findings: list[AuditFinding] = Field(default_factory=list)
    aoc2_transactions: list[AOC2Transaction] = Field(default_factory=list)
    csr_activities: list[CSRActivity] = Field(default_factory=list)