import re
from datetime import datetime
from typing import Dict, Any

from llama_cloud_services import LlamaParse

from config.settings import get_settings


settings = get_settings()


class DocumentParser:
    """Handles PDF parsing (via the LlamaParse SDK) and field extraction.

    NOTE: This previously called LlamaCloud's raw /api/v1/files and
    /api/v1/parsing/parse endpoints directly with httpx. That contract has
    since changed on LlamaCloud's side (hence the
    `{"detail":[{"loc":["body","upload_file"],"msg":"Field required"}]}`
    422 error), and hand-rolling multipart/job-polling logic against a
    moving target is fragile. The official `llama-cloud-services` SDK
    handles upload + parse + polling internally, so we use that instead.
    """

    def __init__(self):
        self.api_key = settings.LLAMA_CLOUD_API_KEY
        self._parser = LlamaParse(
            api_key=self.api_key,
            result_type="markdown",
            verbose=True,
        )

    async def parse_document(
        self,
        file_path: str,
        document_type: str,
    ) -> Dict[str, Any]:
        """
        Parse a PDF and extract structured data for the given document type.
        """

        try:
            # SDK handles upload, job creation, and polling for completion.
            documents = await self._parser.aload_data(file_path)

            markdown_content = "\n\n".join(
                doc.text for doc in documents if getattr(doc, "text", None)
            )

            if not markdown_content:
                return {
                    "success": False,
                    "documentType": document_type,
                    "extractedData": {},
                    "errors": ["LlamaParse returned no readable content for this file."],
                }

            extraction_method = getattr(
                self,
                f"_extract_{document_type}",
                self._extract_generic,
            )

            extracted_data = extraction_method(markdown_content, {})

            return {
                "success": True,
                "documentType": document_type,
                "extractedData": extracted_data,
                "rawText": markdown_content[:5000],
                "confidence": self._calculate_confidence(extracted_data),
            }

        except Exception as e:
            print(f"Error parsing document: {str(e)}")

            return {
                "success": False,
                "documentType": document_type,
                "extractedData": {},
                "errors": [str(e)],
            }

    # ==============================================================
    # COI
    # ==============================================================

    def _extract_coi(self, markdown: str, json_data: dict) -> Dict[str, Any]:
        data = {}

        cin_pattern = r"\b[UL]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}\b"
        cin_match = re.search(cin_pattern, markdown, re.IGNORECASE)
        if cin_match:
            data["cin"] = cin_match.group(0).upper()

        name_patterns = [
            r"(?:Name of Company|Company Name)[:\s]+(.+?)(?:\n|$)",
            r"(?:^|\n)([A-Z][A-Z\s&.,'-]+(?:PRIVATE LIMITED|LIMITED|PVT LTD|LTD))",
        ]
        for pattern in name_patterns:
            name_match = re.search(pattern, markdown, re.IGNORECASE | re.MULTILINE)
            if name_match:
                data["companyName"] = name_match.group(1).strip()
                break

        date_patterns = [
            r"(?:Date of Incorporation|Incorporated on)[:\s]+(\d{1,2}[/-]\d{1,2}[/-]\d{4})",
            r"(?:Date of Incorporation)[:\s]+(\d{1,2}\s+[A-Za-z]+\s+\d{4})",
        ]
        for pattern in date_patterns:
            date_match = re.search(pattern, markdown, re.IGNORECASE)
            if date_match:
                data["dateOfIncorporation"] = self._normalize_date(date_match.group(1))
                break

        address_patterns = [
            r"(?:Registered Office|Registered Address)[:\s]+(.+?)(?:\n\n|\n[A-Z][A-Za-z ]+:|$)",
        ]
        for pattern in address_patterns:
            address_match = re.search(pattern, markdown, re.IGNORECASE | re.DOTALL)
            if address_match:
                address_text = address_match.group(1).strip()
                address_text = re.sub(r"\s+", " ", address_text)
                data["registeredOffice"] = address_text[:500]
                break

        return data

    # ==============================================================
    # MOA
    # ==============================================================

    def _extract_moa(self, markdown: str, json_data: dict) -> Dict[str, Any]:
        data = {}

        object_patterns = [
            r"(?:MAIN OBJECTS?|OBJECTS? OF THE COMPANY)[:\s]+(.+)",
        ]
        for pattern in object_patterns:
            object_match = re.search(pattern, markdown, re.IGNORECASE | re.DOTALL)
            if object_match:
                object_text = object_match.group(1).strip()
                object_text = re.sub(r"\s+", " ", object_text)
                data["objectClause"] = object_text[:1500]
                break

        capital_patterns = [
            r"(?:Authorized Capital|Share Capital)[:\s]+(?:Rs\.?|INR|₹)\s*([\d,]+)",
        ]
        for pattern in capital_patterns:
            capital_match = re.search(pattern, markdown, re.IGNORECASE)
            if capital_match:
                data["authorizedCapital"] = capital_match.group(1).replace(",", "")
                break

        return data

    # ==============================================================
    # AOA
    # ==============================================================

    def _extract_aoa(self, markdown: str, json_data: dict) -> Dict[str, Any]:
        restrictive_keywords = [
            "restriction on transfer",
            "pre-emptive rights",
            "right of first refusal",
            "lock-in",
            "transfer restrictions",
        ]

        markdown_lower = markdown.lower()
        has_restrictions = any(keyword in markdown_lower for keyword in restrictive_keywords)

        return {
            "restrictiveClauses": has_restrictions,
            "transferRestrictions": has_restrictions,
        }

    # ==============================================================
    # DIR-12
    # ==============================================================

    def _extract_dir12(self, markdown: str, json_data: dict) -> Dict[str, Any]:
        data = {"directors": []}

        din_pattern = r"\b\d{8}\b"
        pan_pattern = r"\b[A-Z]{5}\d{4}[A-Z]\b"
        name_pattern = r"\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}\b"

        names = list(dict.fromkeys(re.findall(name_pattern, markdown)))
        dins = list(dict.fromkeys(re.findall(din_pattern, markdown)))
        pans = list(dict.fromkeys(re.findall(pan_pattern, markdown.upper())))

        max_directors = max(len(names), len(dins), len(pans))

        for i in range(max_directors):
            director = {
                "name": names[i] if i < len(names) else "",
                "din": dins[i] if i < len(dins) else "",
                "pan": pans[i] if i < len(pans) else "",
                "experience": 0,
                "shareholding": 0.0,
            }

            if director["name"] or director["din"]:
                data["directors"].append(director)

        data["totalDirectors"] = len(data["directors"])

        return data

    # ==============================================================
    # AUDIT CERTIFICATE
    # ==============================================================

    def _extract_auditCert(self, markdown: str, json_data: dict) -> Dict[str, Any]:
        data = {}

        cert_patterns = [
            r"(?:Certificate No\.?|Cert\. No\.?)[:\s]+([A-Z0-9/-]+)",
        ]
        for pattern in cert_patterns:
            cert_match = re.search(pattern, markdown, re.IGNORECASE)
            if cert_match:
                data["certificateNumber"] = cert_match.group(1)
                break

        return data

    # ==============================================================
    # NON-DISQUALIFICATION CERTIFICATE
    # ==============================================================

    def _extract_nonDisqualCert(self, markdown: str, json_data: dict) -> Dict[str, Any]:
        return self._extract_auditCert(markdown, json_data)

    # ==============================================================
    # GENERIC
    # ==============================================================

    def _extract_generic(self, markdown: str, json_data: dict) -> Dict[str, Any]:
        return {"rawText": markdown[:1000]}

    # ==============================================================
    # DATE NORMALIZATION
    # ==============================================================

    def _normalize_date(self, date_str: str) -> str:
        formats = [
            "%d/%m/%Y",
            "%d-%m-%Y",
            "%m/%d/%Y",
            "%Y-%m-%d",
            "%d %B %Y",
            "%d %b %Y",
        ]

        for fmt in formats:
            try:
                dt = datetime.strptime(date_str.strip(), fmt)
                return dt.strftime("%Y-%m-%d")
            except ValueError:
                continue

        return date_str

    # ==============================================================
    # CONFIDENCE
    # ==============================================================

    def _calculate_confidence(self, data: Dict[str, Any]) -> float:
        if not data:
            return 0.0

        total_fields = len(data)
        filled_fields = 0

        for value in data.values():
            if isinstance(value, str):
                if value.strip():
                    filled_fields += 1
            elif isinstance(value, (int, float)):
                if value != 0:
                    filled_fields += 1
            elif isinstance(value, list):
                if len(value) > 0:
                    filled_fields += 1
            elif isinstance(value, bool):
                filled_fields += 1

        return round(filled_fields / total_fields, 2)