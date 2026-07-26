"""
Main Pipeline Orchestrator - Multi-Model Edition
"""

# ============================================================================
# IMPORTANT: Set this BEFORE any other imports to disable video processing
# ============================================================================
import os
os.environ['DOCLING_DISABLE_VIDEO'] = '1'
# ============================================================================

import json
import yaml
from pathlib import Path
from typing import Dict, List
from loguru import logger
from datetime import datetime

from src.parser.docling_parser_fixed import DoclingParser
from src.parser.text_cleaner import TextCleaner
from src.segmentation.section_detector import SectionDetector
from src.classification.multi_model_classifier import MultiModelClassifier
class IPOClassificationPipeline:
    """IPO Classification Pipeline with Multi-Model Classifier"""
    
    def __init__(self, config_path: str = "config/pipeline_config.yaml"):
        with open(config_path, 'r') as f:
            self.config = yaml.safe_load(f)
        
        self._setup_logging()
        
        logger.info("=" * 80)
        logger.info("IPO Classification Pipeline - Multi-Model Edition")
        logger.info("=" * 80)
        
        self.docling_parser = DoclingParser(self.config['pdf_processing'])
        self.text_cleaner = TextCleaner(self.config['text_cleaning'])
        self.section_detector = SectionDetector(self.config['section_detection'])
        
        categories_config_path = "config/categories.yaml"
        with open(categories_config_path, 'r') as f:
            categories_config = yaml.safe_load(f)
        
        self.categories_list = [
            cat_info['name'] 
            for cat_info in categories_config['categories'].values()
        ]
        
        self.classifier = MultiModelClassifier(
            self.config['classification'],
            self.categories_list
        )
        
        logger.info("✓ Pipeline initialized")
    
    def _setup_logging(self):
        log_dir = Path("logs")
        log_dir.mkdir(exist_ok=True)
        
        log_file = log_dir / f"pipeline_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
        
        logger.add(
            log_file,
            rotation="50 MB",
            retention="7 days",
            level="INFO",
            format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {message}"
        )
    
    def process_document(self, pdf_path: str) -> Dict:
        """Process a single IPO document"""
        
        logger.info("=" * 80)
        logger.info(f"Processing: {Path(pdf_path).name}")
        logger.info("=" * 80)
        
        logger.info("Step 1: Parsing PDF...")
        pages = self.docling_parser.parse_pdf(pdf_path)
        logger.info(f"✓ Extracted {len(pages)} pages")
        
        logger.info("Step 2: Cleaning text...")
        cleaned_pages = self.text_cleaner.clean_pages(pages)
        logger.info(f"✓ Cleaned text")
        
        logger.info("Step 3: Detecting sections...")
        sections = self.section_detector.detect_sections(cleaned_pages)
        logger.info(f"✓ Detected {len(sections)} sections")
        
        logger.info("Step 4: Multi-Model Classification...")
        classifications = self.classifier.classify_batch(sections)
        logger.info(f"✓ Classified {len(classifications)} sections")
        
        logger.info("Step 5: Building output...")
        result = self._build_output(pdf_path, sections, classifications)
        logger.info("✓ Complete")
        
        return result
    
    def _build_output(self, pdf_path: str, sections: List, classifications: List) -> Dict:
        """Build output JSON"""
        
        document_name = Path(pdf_path).name
        
        output = {
            "document": document_name,
            "processed": datetime.now().isoformat(),
            "pipeline": "multi-model",
            "models": {
                "filter": "tinyllama",
                "detector": "gemma:2b",
                "classifier": "phi3:mini",
                "validator": "qwen2:1.5b"
            },
            "sections": []
        }
        
        for section, (category, confidence, details) in zip(sections, classifications):
            section_text = ' '.join([b.text for b in section.text_blocks])
            
            section_data = {
                "title": section.title,
                "category": category,
                "confidence": round(confidence, 3),
                "pages": [section.page_start, section.page_end],
                "level": section.level,
                "text": section_text if self.config['output'].get('include_text', True) else None,
                "pipeline_details": details
            }
            
            output["sections"].append(section_data)
        
        return output
    
    def process_batch(self, pdf_dir: str, output_dir: str = "data/output"):
        """Process multiple PDFs"""
        
        pdf_dir = Path(pdf_dir)
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
        
        pdf_files = list(pdf_dir.glob("*.pdf"))
        
        logger.info(f"Processing {len(pdf_files)} PDF files")
        
        for i, pdf_file in enumerate(pdf_files, 1):
            logger.info(f"\n[{i}/{len(pdf_files)}] {pdf_file.name}")
            
            try:
                result = self.process_document(str(pdf_file))
                
                output_file = output_dir / f"{pdf_file.stem}_classified.json"
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(result, f, indent=2, ensure_ascii=False)
                
                logger.info(f"✓ Saved: {output_file}")
                
            except Exception as e:
                logger.error(f"✗ Error: {e}")

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='IPO Classification Pipeline')
    parser.add_argument('--input', '-i', required=True, help='Input PDF or directory')
    parser.add_argument('--output', '-o', default='data/output', help='Output directory')
    
    args = parser.parse_args()
    
    pipeline = IPOClassificationPipeline()
    
    input_path = Path(args.input)
    
    if input_path.is_file():
        result = pipeline.process_document(str(input_path))
        output_file = Path(args.output) / f"{input_path.stem}_classified.json"
        output_file.parent.mkdir(parents=True, exist_ok=True)
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        print(f"\n✓ Output: {output_file}")
        
    elif input_path.is_dir():
        pipeline.process_batch(str(input_path), args.output)

if __name__ == "__main__":
    main()
