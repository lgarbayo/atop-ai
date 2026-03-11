import urllib.request
import json
import sys

def list_models(api_key):
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
    try:
        with urllib.request.urlopen(url) as response:
            data = json.load(response)
            for m in data.get('models', []):
                print(f"- {m['name']} (supports: {m.get('supportedGenerationMethods')})")
            return True
    except Exception as e:
        print(f"Error listing models: {e}")
        if hasattr(e, 'read'):
            print(f"Details: {e.read().decode()}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python list_models.py <api_key>")
        sys.exit(1)
    
    key = sys.argv[1]
    list_models(key)
