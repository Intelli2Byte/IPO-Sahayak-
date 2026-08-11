"""
Multi-Model Specialized Classifier - FIXED VERSION
Uses 4 Ollama models for different tasks
"""

import ollama
import json
import re
from typing import Dict, List, Tuple
from loguru import logger
from dataclasses import dataclass
from ..segmentation.section_detector import Section

@dataclass
class ModelConfig:
    name: str
    model: str
    task: str
    temperature: float
    max_tokens: int
    weight: float

class MultiModelClassifier:
    """Multi-model classifier using specialized Ollama models"""
    
    def __init__(self, config: Dict, categories: List[str]):
        self.categories = categories
        self.cache = {}
        
        # Define specialized models
        self.models = {
            'filter': ModelConfig(
                name='TinyLlama',
                model='tinyllama',
                task='quick_filter',
                temperature=0.0,
                max_tokens=50,
                weight=0.15
            ),
            'detector': ModelConfig(
                name='Gemma 2B',
                model='gemma:2b',
                task='section_detection',
                temperature=0.1,
                max_tokens=100,
                weight=0.25
            ),
            'classifier': ModelConfig(
                name='Phi-3 Mini',
                model='phi3:mini',
                task='classification',
                temperature=0.1,
                max_tokens=200,
                weight=0.40
            ),
            'validator': ModelConfig(
                name='Qwen 1.5B',
                model='qwen2:1.5b',
                task='validation',
                temperature=0.0,
                max_tokens=100,
                weight=0.20
            )
        }
        
        self._verify_models()
        
        logger.info("=" * 80)
        logger.info("Multi-Model Classifier Initialized")
        logger.info("=" * 80)
        for key, model in self.models.items():
            logger.info(f"  {model.task:20s} → {model.model:15s}")
        logger.info("=" * 80)
    
    def _verify_models(self):
        """Verify all models are available - FIXED"""
        try:
            available_models = ollama.list()
            
            # Handle different response structures
            if isinstance(available_models, dict):
                models_list = available_models.get('models', [])
            else:
                models_list = available_models
            
            # Extract model names safely
            available_names = []
            for m in models_list:
                if isinstance(m, dict):
                    # Try different possible keys
                    name = m.get('name') or m.get('model') or m.get('id', '')
                else:
                    name = str(m)
                available_names.append(name)
            
            logger.info(f"Available Ollama models: {available_names}")
            
            # Check each required model
            for key, model in self.models.items():
                model_base = model.model.split(':')[0]
                found = any(model_base in name for name in available_names)
                
                if found:
                    logger.info(f"✓ {model.name} ({model.model}) - Available")
                else:
                    logger.warning(f"✗ {model.name} ({model.model}) - Run: ollama pull {model.model}")
                    
        except Exception as e:
            logger.error(f"Error verifying models: {e}")
            logger.info("Continuing anyway - models will be checked during classification")
    
    def classify(self, section: Section) -> Tuple[str, float, Dict]:
        """Classify section using multi-model pipeline"""
        
        results = {}
        
        # Step 1: Quick Filter
        filter_result = self._quick_filter(section)
        results['filter'] = filter_result
        
        if not filter_result['is_valid']:
            return ("Unknown", 0.0, results)
        
        # Step 2: Section Detection
        detection_result = self._detect_section_type(section)
        results['detection'] = detection_result
        
        # Step 3: Classification
        classification_result = self._classify_section(section, detection_result)
        results['classification'] = classification_result
        
        # Step 4: Validation
        validation_result = self._validate_classification(
            section, 
            classification_result['category'],
            detection_result
        )
        results['validation'] = validation_result
        
        # Combine results
        final_category, final_confidence = self._combine_results(results)
        
        return (final_category, final_confidence, results)
    
    def _quick_filter(self, section: Section) -> Dict:
        """Step 1: Quick filter using TinyLlama"""
        
        text_preview = section.title[:100]
        
        prompt = f"""Is this a real document section or noise?

Title: {text_preview}

JSON: {{"is_valid": true/false}}"""
        
        try:
            response = ollama.generate(
                model=self.models['filter'].model,
                prompt=prompt,
                options={
                    'temperature': 0.0,
                    'num_predict': 50,
                }
            )
            
            result = self._parse_json(response['response'])
            return {
                'is_valid': result.get('is_valid', True),
                'model': 'tinyllama'
            }
            
        except Exception as e:
            logger.warning(f"Filter error: {e}")
            return {'is_valid': True, 'model': 'tinyllama'}
    
    def _detect_section_type(self, section: Section) -> Dict:
        """Step 2: Detect section type using Gemma"""
        
        text_preview = ' '.join([b.text for b in section.text_blocks[:3]])[:200]
        
        prompt = f"""Analyze this IPO section.

Title: {section.title}
Content: {text_preview}

JSON: {{"section_type": "financial/legal/descriptive", "characteristics": ["..."]}}"""
        
        try:
            response = ollama.generate(
                model=self.models['detector'].model,
                prompt=prompt,
                options={'temperature': 0.1, 'num_predict': 100}
            )
            
            result = self._parse_json(response['response'])
            return {
                'section_type': result.get('section_type', 'unknown'),
                'characteristics': result.get('characteristics', []),
                'model': 'gemma:2b'
            }
            
        except Exception as e:
            logger.warning(f"Detection error: {e}")
            return {'section_type': 'unknown', 'characteristics': [], 'model': 'gemma:2b'}
    
    def _classify_section(self, section: Section, detection_result: Dict) -> Dict:
        """Step 3: Main classification using Phi-3"""
        
        text_preview = ' '.join([b.text for b in section.text_blocks[:5]])[:300]
        
        categories_str = ', '.join([
            "Risk Factors", "Objects of the Issue", "Company Overview",
            "Financial Statements", "Management Team", "Business Description",
            "Capital Structure", "Promoter Details", "Issue Information",
            "Unknown"
        ])
        
        prompt = f"""Classify this IPO section.

Title: {section.title}
Content: {text_preview}

Categories: {categories_str}

JSON: {{"category": "...", "confidence": 0.0-1.0}}"""
        
        try:
            response = ollama.generate(
                model=self.models['classifier'].model,
                prompt=prompt,
                options={'temperature': 0.1, 'num_predict': 200}
            )
            
            result = self._parse_json(response['response'])
            category = result.get('category', 'Unknown')
            confidence = float(result.get('confidence', 0.5))
            
            if category not in self.categories and category != 'Unknown':
                category = self._fuzzy_match(category)
            
            return {
                'category': category,
                'confidence': confidence,
                'model': 'phi3:mini'
            }
            
        except Exception as e:
            logger.warning(f"Classification error: {e}")
            return {'category': 'Unknown', 'confidence': 0.0, 'model': 'phi3:mini'}
    
    def _validate_classification(self, section: Section, predicted_category: str, 
                                 detection_result: Dict) -> Dict:
        """Step 4: Validate using Qwen"""
        
        prompt = f"""Validate classification.

Title: {section.title[:100]}
Category: {predicted_category}

JSON: {{"is_valid": true/false, "confidence_adjustment": -0.2 to +0.2}}"""
        
        try:
            response = ollama.generate(
                model=self.models['validator'].model,
                prompt=prompt,
                options={'temperature': 0.0, 'num_predict': 100}
            )
            
            result = self._parse_json(response['response'])
            return {
                'is_valid': result.get('is_valid', True),
                'confidence_adjustment': float(result.get('confidence_adjustment', 0.0)),
                'model': 'qwen2:1.5b'
            }
            
        except Exception as e:
            logger.warning(f"Validation error: {e}")
            return {'is_valid': True, 'confidence_adjustment': 0.0, 'model': 'qwen2:1.5b'}
    
    def _combine_results(self, results: Dict) -> Tuple[str, float]:
        """Combine results from all models"""
        
        classification = results.get('classification', {})
        category = classification.get('category', 'Unknown')
        confidence = classification.get('confidence', 0.5)
        
        validation = results.get('validation', {})
        if not validation.get('is_valid', True):
            confidence *= 0.7
        
        confidence += validation.get('confidence_adjustment', 0.0)
        confidence = max(0.0, min(1.0, confidence))
        
        return (category, confidence)
    
    def _parse_json(self, response_text: str) -> Dict:
        """Parse JSON from response"""
        try:
            json_match = re.search(r'\{[^}]+\}', response_text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(0))
            return {}
        except:
            return {}
    
    def _fuzzy_match(self, category: str) -> str:
        """Fuzzy match category"""
        category_lower = category.lower()
        for valid_cat in self.categories:
            if valid_cat.lower() in category_lower or category_lower in valid_cat.lower():
                return valid_cat
        return "Unknown"
    
    def classify_batch(self, sections: List[Section]) -> List[Tuple[str, float, Dict]]:
        """Classify multiple sections"""
        results = []
        
        for i, section in enumerate(sections):
            logger.info(f"[{i+1}/{len(sections)}] {section.title[:50]}")
            result = self.classify(section)
            results.append(result)
        
        return results