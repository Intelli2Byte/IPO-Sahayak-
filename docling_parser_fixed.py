"""
Docling-based PDF Parser - NO VIDEO FEATURES
Optimized for IPO document processing
"""

import os
os.environ['DOCLING_DISABLE_VIDEO'] = '1'

# FIXED: Added PdfFormatOption to the import statement
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.base_models import InputFormat
from docling.datamodel.pipeline_options import PdfPipelineOptions

from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass
from pathlib import Path
from loguru import logger

@dataclass
class TextBlock:
    text: str
    page_num: int
    bbox: Tuple[float, float, float, float]
    font_size: float
    font_name: str
    is_bold: bool
    is_italic: bool
    block_type: str
    level: int

@dataclass
class TableBlock:
    page_num: int
    bbox: Tuple[float, float, float, float]
    data: List[List[str]]
    num_rows: int
    num_cols: int

@dataclass
class PageLayout:
    page_num: int
    width: float
    height: float
    text_blocks: List[TextBlock]
    tables: List[TableBlock]
    images: List[Dict]

class DoclingParser:
    
    def __init__(self, config: Dict):
        self.config = config
        
        pipeline_options = PdfPipelineOptions()
        pipeline_options.do_ocr = config.get('ocr_enabled', False)
        pipeline_options.do_table_structure = config.get('extract_tables', True)
        
        self.converter = DocumentConverter(
            allowed_formats=[InputFormat.PDF],
            format_options={
                # FIXED: Wrapped pipeline_options inside PdfFormatOption
                InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)
            }
        )
        
        logger.info("✓ Docling parser initialized (PDF-only mode)")
    
    def parse_pdf(self, pdf_path: str) -> List[PageLayout]:
        logger.info(f"Parsing PDF: {Path(pdf_path).name}")
        
        try:
            result = self.converter.convert(pdf_path)
            pages_layout = self._extract_layout_from_docling(result)
            logger.info(f"✓ Parsed {len(pages_layout)} pages")
            return pages_layout
        except Exception as e:
            logger.error(f"Error parsing PDF: {e}")
            raise
    
    def _extract_layout_from_docling(self, doc_result) -> List[PageLayout]:
        pages_layout = []
        doc = doc_result.document
        pages_dict = {}
        
        for element, level in doc.iterate_items():
            page_num = element.prov[0].page_no if element.prov else 1
            
            if page_num not in pages_dict:
                pages_dict[page_num] = {
                    'text_blocks': [],
                    'tables': [],
                    'images': [],
                    'width': 612,
                    'height': 792
                }
            
            if hasattr(element, 'text') and element.text:
                text_block = self._create_text_block(element, page_num, level)
                if text_block:
                    pages_dict[page_num]['text_blocks'].append(text_block)
            
            if element.__class__.__name__ == 'TableItem':
                table_block = self._create_table_block(element, page_num)
                if table_block:
                    pages_dict[page_num]['tables'].append(table_block)
            
            if element.prov and pages_dict[page_num]['width'] == 612:
                bbox = element.prov[0].bbox
                pages_dict[page_num]['width'] = bbox.r
                pages_dict[page_num]['height'] = bbox.b
        
        for page_num in sorted(pages_dict.keys()):
            page_data = pages_dict[page_num]
            page_layout = PageLayout(
                page_num=page_num,
                width=page_data['width'],
                height=page_data['height'],
                text_blocks=page_data['text_blocks'],
                tables=page_data['tables'],
                images=page_data['images']
            )
            pages_layout.append(page_layout)
        
        return pages_layout
    
    def _create_text_block(self, element, page_num: int, level: int) -> Optional[TextBlock]:
        try:
            text = element.text.strip()
            if not text:
                return None
            
            bbox = (0, 0, 0, 0)
            if element.prov:
                prov_bbox = element.prov[0].bbox
                bbox = (prov_bbox.l, prov_bbox.t, prov_bbox.r, prov_bbox.b)
            
            element_type = element.__class__.__name__
            
            block_type = 'text'
            is_bold = False
            font_size = 12.0
            heading_level = 0
            
            if 'Title' in element_type:
                block_type = 'title'
                is_bold = True
                font_size = 18.0
                heading_level = 1
            elif 'SectionHeader' in element_type or 'Heading' in element_type:
                block_type = 'heading'
                is_bold = True
                font_size = 14.0
                heading_level = level if level > 0 else 2
            elif 'ListItem' in element_type:
                block_type = 'list'
            
            if text.isupper() and len(text) > 5 and len(text) < 100:
                block_type = 'heading'
                is_bold = True
                heading_level = heading_level or 2
            
            return TextBlock(
                text=text,
                page_num=page_num,
                bbox=bbox,
                font_size=font_size,
                font_name="Unknown",
                is_bold=is_bold,
                is_italic=False,
                block_type=block_type,
                level=heading_level
            )
        except Exception as e:
            logger.warning(f"Error creating text block: {e}")
            return None
    
    def _create_table_block(self, element, page_num: int) -> Optional[TableBlock]:
        try:
            bbox = (0, 0, 0, 0)
            if element.prov:
                prov_bbox = element.prov[0].bbox
                bbox = (prov_bbox.l, prov_bbox.t, prov_bbox.r, prov_bbox.b)
            
            table_data = []
            
            if hasattr(element, 'data') and element.data:
                if hasattr(element.data, 'table_cells'):
                    max_row = max((cell.row_span + cell.start_row_offset_idx 
                                 for cell in element.data.table_cells), default=0)
                    max_col = max((cell.col_span + cell.start_col_offset_idx 
                                 for cell in element.data.table_cells), default=0)
                    
                    if max_row > 0 and max_col > 0:
                        grid = [['' for _ in range(max_col)] for _ in range(max_row)]
                        
                        for cell in element.data.table_cells:
                            row = cell.start_row_offset_idx
                            col = cell.start_col_offset_idx
                            text = ' '.join([t.text for t in cell.text if hasattr(t, 'text')])
                            if row < max_row and col < max_col:
                                grid[row][col] = text
                        
                        table_data = grid
            
            if not table_data:
                return None
            
            return TableBlock(
                page_num=page_num,
                bbox=bbox,
                data=table_data,
                num_rows=len(table_data),
                num_cols=len(table_data[0]) if table_data else 0
            )
        except Exception as e:
            logger.warning(f"Error creating table block: {e}")
            return None