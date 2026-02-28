"""
services/llm_expander.py — Expansión de consultas usando GPT-2 (Text Continuation).
"""

import logging
import asyncio
from typing import Optional

logger = logging.getLogger(__name__)


class QueryExpanderModel:
    _instance: Optional["QueryExpanderModel"] = None
    _lock = asyncio.Lock()

    def __init__(self):
        import torch
        from transformers import AutoTokenizer, AutoModelForCausalLM

        logger.info("🔄 Cargando DeepESP/gpt2-spanish en CPU...")
        self.device = "cpu"
        model_name = "DeepESP/gpt2-spanish"

        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(
            model_name,
            dtype=torch.float32,
        )

        # Cuantización para optimizar RAM
        self.model = torch.quantization.quantize_dynamic(
            self.model, {torch.nn.Linear}, dtype=torch.qint8
        )
        self.model.eval()

    @classmethod
    async def get_instance(cls) -> "QueryExpanderModel":
        if cls._instance is None:
            async with cls._lock:
                if cls._instance is None:
                    cls._instance = await asyncio.to_thread(cls)
        return cls._instance

    def expand_query_sync(self, user_query: str) -> str:
        # Terminamos el prompt con ": " (sin salto de línea) para que GPT-2
        # continúe en la misma línea y no empiece generando un \n vacío.
        prompt = f"Palabras relacionadas a {user_query}: "

        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.device)

        import torch

        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=24,  # Más tokens para capturar varias palabras clave
                temperature=0.5,
                do_sample=True,
                top_k=50,
                top_p=0.9,
                pad_token_id=self.tokenizer.eos_token_id,
            )

        # Recortar solo lo nuevo generado
        input_length = inputs.input_ids.shape[1]
        generated_tokens = outputs[0][input_length:]
        response = self.tokenizer.decode(generated_tokens, skip_special_tokens=True)

        # Unir todas las líneas en una sola (evita que un \n inicial vacíe el resultado)
        clean_response = " ".join(response.split())

        # Truncar en el primer punto para quedarnos con la primera oración/lista
        if "." in clean_response:
            clean_response = clean_response[:clean_response.index(".")]

        # Eliminamos signos de puntuación extraños al final si los hay
        clean_response = clean_response.rstrip(".,;")

        logger.info(f"🧠 GPT-2 Autocompletado: '{user_query}' -> '{clean_response}'")
        return clean_response


async def expand_query_async(user_query: str, max_keywords: int = 5) -> str:
    model = await QueryExpanderModel.get_instance()
    return await asyncio.to_thread(model.expand_query_sync, user_query)
