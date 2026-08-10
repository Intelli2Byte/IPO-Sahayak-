from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class Director(BaseModel):
    name: str
    din: Optional[str] = None
    pan: Optional[str] = None
    experience: Optional[int] = 0
    shareholding: Optional[float] = 0.0
    mobile: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    background: Optional[str] = None


class COIExtractedData(BaseModel):
    """Certificate of Incorporation extracted data"""
    cin: Optional[str] = None
    companyName: Optional[str] = None
    dateOfIncorporation: Optional[str] = None
    registeredOffice: Optional[str] = None
    authorizedCapital: Optional[str] = None


class MOAExtractedData(BaseModel):
    """Memorandum of Association extracted data"""
    objectClause: Optional[str] = None
    authorizedCapital: Optional[str] = None
    shareStructure: Optional[Dict[str, Any]] = None


class AOAExtractedData(BaseModel):
    """Articles of Association extracted data"""
    restrictiveClauses: Optional[bool] = None
    transferRestrictions: Optional[str] = None
    governanceRules: Optional[List[str]] = None


class DIR12ExtractedData(BaseModel):
    """MCA Form DIR-12 extracted data"""
    directors: Optional[List[Director]] = None
    totalDirectors: Optional[int] = None


class AuditCertExtractedData(BaseModel):
    """Audit Certificate extracted data"""
    certificateNumber: Optional[str] = None
    issueDate: Optional[str] = None
    auditorName: Optional[str] = None
    complianceStatus: Optional[str] = None


class DocumentParseResponse(BaseModel):
    success: bool
    documentType: str
    extractedData: Dict[str, Any]
    confidence: Optional[float] = None
    rawText: Optional[str] = None
    errors: Optional[List[str]] = None
    savedTo: Optional[str] = None  # path of the persisted JSON file, for reference