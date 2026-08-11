from llama_cloud import LlamaCloud
from fireworks import Fireworks
import config

llama_client = LlamaCloud(api_key=config.LLAMA_CLOUD_API_KEY)
fireworks_client = Fireworks(api_key=config.FIREWORKS_API_KEY)