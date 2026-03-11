"""
services/llm_service.py — EL CEREBRO DE LA APLICACIÓN (IA).
---------------------------------------------------------
Versión recuperada del commit "fix: mobile responsive" pero manteniendo 
la arquitectura de aislamiento (multi-tenancy) por API Key.
"""

import logging
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)


# ═══════════════════════════════════════════════════════════════
#  INTERFAZ ABSTRACTA
# ═══════════════════════════════════════════════════════════════

class BaseLLMProvider(ABC):
    """Contrato base que deben implementar todos los proveedores de IA."""

    @abstractmethod
    def summarize(self, text: str) -> str:
        """Sintetiza el contenido de un documento en unos pocos párrafos clave."""
        ...

    @abstractmethod
    def chat(self, prompt: str, context: str, history: list[dict] = None) -> str:
        """Genera una respuesta sopesando la pregunta contra el contexto corporativo."""
        ...

    @abstractmethod
    def chat_stream(self, prompt: str, context: str, history: list[dict] = None):
        """Versión asíncrona por generador para interfaces de chat fluido."""
        ...


# ═══════════════════════════════════════════════════════════════
#  PROVEEDOR GOOGLE GEMINI (SDK)
# ═══════════════════════════════════════════════════════════════

class GeminiProvider(BaseLLMProvider):
    """
    Integración con Google Gemini (Generative AI SDK).
    Mantiene el aislamiento usando la API Key proporcionada por el usuario.
    """
    def __init__(self, api_key: str = None):
        import google.generativeai as genai
        from core.config import settings
        
        # Prioridad: Clave pasada por argumento > Ajustes globales
        actual_key = api_key or settings.GEMINI_API_KEY
        actual_model = settings.GEMINI_LLM_MODEL or "gemini-2.0-flash"
        
        if not actual_key:
            logger.error("❌ No se ha configurado ninguna GEMINI_API_KEY")
            raise Exception("API Key de Gemini no configurada.")

        genai.configure(api_key=actual_key)
        self.model = genai.GenerativeModel(actual_model)
        
        masked_key = f"{actual_key[:6]}...{actual_key[-4:]}" if actual_key and len(actual_key) > 10 else "N/A"
        logger.info(f"✅ Gemini SDK inicializado: {actual_model} (Key: {masked_key})")

    def summarize(self, text: str) -> str:
        prompt = (
            f"Resume el siguiente texto corporativo en 3-5 frases concisas en español. "
            f"Responde SOLO con el resumen:\n\n{text}"
        )
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"❌ Error en summarize (SDK): {e}")
            raise

    def _build_content_gemini(self, prompt: str, context: str, history: list[dict] = None) -> str:
        historico = ""
        if history:
            for msg in history[-6:]:
                role = "Usuario" if msg.get("role") == "user" else "Asistente"
                historico += f"{role}: {msg.get('content')}\n\n"
        
        full_prompt = (
            f"Eres un asistente corporativo. Responde basándote SOLO en el contexto. "
            f"Si la información no está en el documento, indícalo claramente.\n"
            f"Usa notación [1], [2] para citar las fuentes numeradas.\n\n"
            f"Contexto:\n{context}\n\n"
        )
        if historico:
            full_prompt += f"Historial:\n{historico}"
            
        full_prompt += f"Pregunta: {prompt}"
        return full_prompt

    def chat(self, prompt: str, context: str, history: list[dict] = None) -> str:
        full_prompt = self._build_content_gemini(prompt, context, history)
        try:
            response = self.model.generate_content(full_prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"❌ Error en chat (SDK): {e}")
            raise

    def chat_stream(self, prompt: str, context: str, history: list[dict] = None):
        full_prompt = self._build_content_gemini(prompt, context, history)
        try:
            response = self.model.generate_content(full_prompt, stream=True)
            for chunk in response:
                if chunk.text:
                    yield chunk.text
        except Exception as e:
            logger.error(f"❌ Error en chat_stream (SDK): {e}")
            raise


# ═══════════════════════════════════════════════════════════════
#  FACTORY — selecciona el proveedor
# ═══════════════════════════════════════════════════════════════

class LLMFactory:
    _instance: BaseLLMProvider | None = None

    @classmethod
    def get_provider(cls, api_key: str = None) -> BaseLLMProvider:
        # Si hay API key de usuario, creamos una instancia volátil (aislamiento total)
        if api_key:
            return GeminiProvider(api_key=api_key)
            
        # Si no, creamos/usamos el singleton global (con la clave del .env)
        if cls._instance is None:
            logger.info("🏭 Inicializando LLM provider global (SDK)")
            cls._instance = GeminiProvider()
        return cls._instance

    @classmethod
    def reset(cls) -> None:
        cls._instance = None


def get_llm_service(api_key: str = None) -> BaseLLMProvider:
    return LLMFactory.get_provider(api_key=api_key)
