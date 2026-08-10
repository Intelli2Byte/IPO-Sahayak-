from typing import Dict, Any


class FieldMapper:
    """Maps extracted data to frontend form field structure."""

    @staticmethod
    def map_to_frontend(
        document_type: str,
        extracted_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Map extracted data to frontend field names.
        """
        mapper_method = getattr(
            FieldMapper,
            f"_map_{document_type}",
            FieldMapper._map_generic
        )

        return mapper_method(extracted_data)

    @staticmethod
    def _map_coi(data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "cin": data.get("cin"),
            "companyName": data.get("companyName"),
            "dateOfIncorporation": data.get("dateOfIncorporation"),
            "registeredOffice": data.get("registeredOffice"),
        }

    @staticmethod
    def _map_moa(data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "objectClause": data.get("objectClause"),
            "authorizedCapital": data.get("authorizedCapital"),
        }

    @staticmethod
    def _map_aoa(data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "restrictiveClauses": data.get("restrictiveClauses"),
            "transferRestrictions": data.get("transferRestrictions"),
        }

    @staticmethod
    def _map_dir12(data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "directors": data.get("directors", []),
            "totalDirectors": data.get("totalDirectors", 0),
        }

    @staticmethod
    def _map_auditCert(data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "certificateNumber": data.get("certificateNumber"),
            "issueDate": data.get("issueDate"),
            "auditorName": data.get("auditorName"),
            "complianceStatus": data.get("complianceStatus"),
        }

    @staticmethod
    def _map_nonDisqualCert(data: Dict[str, Any]) -> Dict[str, Any]:
        return FieldMapper._map_auditCert(data)

    @staticmethod
    def _map_generic(data: Dict[str, Any]) -> Dict[str, Any]:
        return data