# Guía de Contribución

¡Gracias por tu interés en contribuir a MeigaSearch! Esta guía te ayudará a entender cómo participar en el desarrollo.

## 📋 Requisitos Previos

- Git configurado en tu máquina
- Python 3.11+
- Node.js 18+ (si modificas el frontend)
- Docker & Docker Compose (recomendado para testing)

## Configuración del Entorno de Desarrollo

### Backend (Python)

```bash
# Clonar o abrir el repositorio
cd meiga-search/backend

# Crear virtual environment
python -m venv venv
source venv/bin/activate  # macOS/Linux
# o
venv\Scripts\activate  # Windows

# Instalar dependencias
pip install -r requirements.txt

# Instalar herramientas de desarrollo
pip install pytest pytest-cov black flake8 mypy

# Ejecutar tests
pytest tests/

# Ejecutar linter
black . && flake8 .
```

### Iniciar servicios locales

```bash
# Desde meiga-search/backend
docker compose up
```

Esto arranca:
- Qdrant (puerto 6333)
- Redis (puerto 6379)
- FastAPI (puerto 8000)
- Celery Workers

## Estándares de Código

### Python

- **Estilo**: PEP 8 (enforced con Black)
- **Tipado**: Usar type hints siempre que sea posible
- **Docstrings**: Google-style docstrings para funciones públicas
- **Longitud de línea**: Máximo 100 caracteres
- **Imports**: Ordenados con `isort`

```python
def extract_document_content(file_path: str) -> tuple[str, dict]:
    """
    Extrae texto y metadatos de un archivo.

    Args:
        file_path: Ruta absoluta al archivo.

    Returns:
        Tupla (texto_crudo, metadatos_dict).

    Raises:
        FileNotFoundError: Si el archivo no existe.
    """
    pass
```

### JavaScript/Frontend

- **Estilo**: Vanilla JS (sin frameworks innecesarios)
- **Indentación**: 2 espacios
- **Nomenclatura**: camelCase para variables/funciones, snake_case para IDs HTML

## 🔄 Flujo de Contribución

### 1. Crear una rama temática

```bash
git checkout -b feature/mi-nueva-feature
# o
git checkout -b fix/bug-que-arreglo
```

Nombres sugeridos:
- `feature/nombre-descriptivo` - Para nuevas features
- `fix/nombre-bug` - Para arreglos
- `refactor/nombre` - Para refactorización
- `docs/nombre` - Para documentación

### 2. Hacer cambios

- Mantén commits atómicos y descriptivos
- Escribe mensajes en inglés o español (consistente)
- Una feature por rama

```bash
git add .
git commit -m "feat: Agregar filtro por mes a búsqueda"
# o
git commit -m "fix: Arreglar timeout en búsqueda híbrida"
```

### 3. Tests y Linting

Antes de hacer push:

```bash
# Tests
pytest tests/ -v --cov=app

# Linting
black .
flake8 .
mypy app/

# Type checking (Python)
mypy backend/
```

### 4. Pull Request

- Describe el problema que resuelves
- Incluye pasos para reproducir (si es un arreglo)
- Menciona cualquier cambio de API
- Referencia issues relacionados (`Closes #123`)

**Template PR:**

```markdown
## Descripción
Breve descrición de qué hace el PR.

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva feature
- [ ] Breaking change
- [ ] Cambio de documentación

## Cómo probar
Pasos para reproducir o testing instructions.

## Checklist
- [ ] Mi código sigue los estándares de estilo
- [ ] He ejecutado tests localmente
- [ ] He actualizado la documentación
- [ ] Sin errores de linting
```

## Reportar Bugs

Usa GitHub Issues con este formato:

```markdown
**Describir el bug**
Descripción clara de qué está mal.

**Reproducir**
Pasos para reproducir el comportamiento:
1. Ir a '...'
2. Clickear en '...'
3. Ver error

**Comportamiento esperado**
Qué debería pasar.

**Capturas o logs**
Si aplica, adjunta logs del backend.

**Entorno**
- OS: [e.g. macOS 13.2]
- Python: [e.g. 3.11.2]
- Docker: [e.g. 20.10]
```

## Estructura del Proyecto

```
meiga-search/
├── backend/
│   ├── api/
│   │   └── routes.py          # Endpoints principales
│   ├── services/
│   │   ├── vector_db.py       # Qdrant + Embeddings
│   │   ├── document_extractor.py  # OCR + Metadatos
│   │   └── llm_service.py     # Integración LLM
│   ├── workers/
│   │   └── tasks.py           # Tareas Celery
│   ├── tests/
│   │   └── test_*.py
│   ├── main.py                # Punto de entrada FastAPI
│   └── requirements.txt
├── frontend/
│   └── index.html             # SPA vanilla JS
└── docker-compose.yml
```

## Hacer un Release

1. Actualizar `CHANGELOG.md`
2. Actualizar versión en `main.py` o archivo de versión
3. Crear tag en git: `git tag v1.0.0`
4. Push: `git push origin v1.0.0`

## Consejos

- Lee el código existente antes de escribir cambios
- Los tests son obligatorios para features
- Mantén commits pequeños y enfocados
- Actualiza la documentación con tus cambios
- Sé respetuoso en reviews y discussions

## Preguntas

- Issues para bugs y features
- Discussions para hacer preguntas
- Email a meigasearch@example.com para temas sensibles

¡Gracias por contribuir a MeigaSearch! 🎉
