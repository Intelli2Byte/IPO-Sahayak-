"""
Section Detection and Segmentation
"""

import re
from typing import List, Dict, Tuple
from dataclasses import dataclass
from loguru import logger
from ..parser.docling_parser_fixed import PageLayout, TextBlock

# FIXED: Removed the duplicate @dataclass Section block that was here
@dataclass
class Section:
    """Represents a document section"""
    title: str
    level: int
    page_start: int
    page_end: int
    text_blocks: List[TextBlock]
    subsections: List['Section']

class SectionDetector:
    """Detects section boundaries in IPO documents"""
    
    def __init__(self, config: Dict):
        self.config = config
        self.min_section_length = config.get('min_section_length', 100)
        
    def detect_sections(self, pages: List[PageLayout]) -> List[Section]:
        """Detect all sections in document"""
        
        logger.info("Detecting document sections")
        
        all_blocks = []
        for page in pages:
            all_blocks.extend(page.text_blocks)
        
        heading_blocks = self._identify_headings(all_blocks)
        logger.info(f"✓ Found {len(heading_blocks)} headings")
        
        sections = self._build_sections(all_blocks, heading_blocks)
        logger.info(f"✓ Detected {len(sections)} top-level sections")
        
        return sections
    
    def _identify_headings(self, blocks: List[TextBlock]) -> List[Tuple[int, TextBlock, int]]:
        """Identify heading blocks and their levels"""
        
        headings = []
        
        for idx, block in enumerate(blocks):
            if block.block_type in ['heading', 'title']:
                heading_level = block.level if block.level > 0 else self._calculate_heading_level(block)
                headings.append((idx, block, heading_level))
            elif self._looks_like_heading(block):
                heading_level = self._calculate_heading_level(block)
                if heading_level > 0:
                    headings.append((idx, block, heading_level))
        
        return headings
    
    def _looks_like_heading(self, block: TextBlock) -> bool:
        """Additional heuristic to detect headings"""
        
        text = block.text.strip()
        
        if len(text) > 200 or len(text) < 3:
            return False
        
        indicators = 0
        
        if block.is_bold:
            indicators += 1
        
        if text.isupper() and len(text) > 5:
            indicators += 1
        
        if re.match(r'^([IVX]+\.|[\d]+\.|[\d]+\.[\d]+)', text):
            indicators += 1
        
        ipo_keywords = [
            'risk factors', 'objects of', 'company overview', 'industry overview',
            'promoter', 'management', 'board of directors', 'financial',
            'capital structure', 'shareholding', 'dividend', 'litigation'
        ]
        
        if any(keyword in text.lower() for keyword in ipo_keywords):
            indicators += 1
        
        return indicators >= 2
    
    def _calculate_heading_level(self, block: TextBlock) -> int:
        """Calculate heading level"""
        
        if block.level > 0:
            return block.level
        
        score = 0
        text = block.text.strip()
        
        if block.font_size > 16:
            score += 3
        elif block.font_size > 14:
            score += 2
        elif block.font_size > 12:
            score += 1
        
        if block.is_bold:
            score += 2
        
        if text.isupper() and len(text) > 5:
            score += 2
        
        numbering_patterns = [
            (r'^[IVX]+\.?\s+[A-Z]', 3),
            (r'^\d+\.?\s+[A-Z]', 2),
            (r'^\d+\.\d+\.?\s+', 1),
        ]
        
        for pattern, points in numbering_patterns:
            if re.match(pattern, text):
                score += points
                break
        
        if score >= 5:
            return 1
        elif score >= 3:
            return 2
        elif score >= 2:
            return 3
        else:
            return 0
    
    def _build_sections(self, all_blocks: List[TextBlock], 
                       headings: List[Tuple[int, TextBlock, int]]) -> List[Section]:
        """Build hierarchical section structure"""
        
        if not headings:
            return [Section(
                title="Document",
                level=1,
                page_start=all_blocks[0].page_num if all_blocks else 1,
                page_end=all_blocks[-1].page_num if all_blocks else 1,
                text_blocks=all_blocks,
                subsections=[]
            )]
        
        sections = []
        
        for i, (idx, heading_block, level) in enumerate(headings):
            if i < len(headings) - 1:
                next_idx = headings[i + 1][0]
            else:
                next_idx = len(all_blocks)
            
            section_blocks = all_blocks[idx:next_idx]
            
            section = Section(
                title=heading_block.text.strip(),
                level=level,
                page_start=heading_block.page_num,
                page_end=section_blocks[-1].page_num if section_blocks else heading_block.page_num,
                text_blocks=section_blocks,
                subsections=[]
            )
            
            sections.append(section)
        
        hierarchical_sections = self._build_hierarchy(sections)
        return hierarchical_sections
    
    def _build_hierarchy(self, flat_sections: List[Section]) -> List[Section]:
        """Convert flat list of sections into hierarchical structure"""
        
        if not flat_sections:
            return []
        
        root_sections = []
        stack = []
        
        for section in flat_sections:
            while stack and stack[-1][1] >= section.level:
                stack.pop()
            
            if not stack:
                root_sections.append(section)
            else:
                parent = stack[-1][0]
                parent.subsections.append(section)
            
            stack.append((section, section.level))
        
        return root_sections